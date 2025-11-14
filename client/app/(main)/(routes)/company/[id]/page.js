'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table'
import { IconDotsVertical, IconPlus } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Page = ({ params }) => {
    const { id } = React.use(params)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const [company, setCompany] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [editProduct, setEditProduct] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [addOpen, setAddOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({
        productName: '',
        quantity: '',
        amount: '',
        payment: 'Debit',
        category: '',
        status: 'pending',
        SKU: '',
    })
    const [updatedProduct, setUpdatedProduct] = useState({})

    // Fetch company and categories
    const fetchCompany = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/company/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) setCompany(data.company)
            else toast.error(data.msg || 'Failed to fetch company')
        } catch (err) {
            console.error(err)
            toast.error('Error fetching company')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/category', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (res.ok) setCategories(data.categories || [])
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (id) fetchCompany()
        fetchCategories()
    }, [id, token])

    const categoryMap = Object.fromEntries(
        categories.map((cat) => [String(cat._id), cat.name])
    )

    // ✅ Add Product
    const addProduct = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...newProduct, company: id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.msg || 'Failed to add product')
            toast.success('Product added!')
            setAddOpen(false)
            setNewProduct({
                productName: '',
                quantity: '',
                amount: '',
                payment: 'Debit',
                category: '',
                status: 'pending',
                SKU: '',
            })
            fetchCompany()
        } catch (err) {
            toast.error(err.message)
        }
    }

    // ✅ Update Product
    const updateProduct = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/product/${editProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProduct),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.msg || 'Failed to update product')
            toast.success('Product updated!')
            setEditProduct(null)
            fetchCompany()
        } catch (err) {
            toast.error(err.message)
        }
    }

    // ✅ Delete Product
    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/product/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.msg || 'Failed to delete')
            toast.success('Product deleted!')
            setDeleteId(null)
            fetchCompany()
        } catch (err) {
            toast.error(err.message)
        }
    }

    if (loading) return <p>Loading company...</p>
    if (!company) return <p>No company found</p>

    const products = company?.products || []

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold uppercase">{company.companyName}</h1>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <IconPlus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2">
                            <Select
                                value={newProduct.category}
                                onValueChange={(val) =>
                                    setNewProduct({ ...newProduct, category: val })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input
                                placeholder="Product Name"
                                value={newProduct.productName}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, productName: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Quantity"
                                type="number"
                                value={newProduct.quantity}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, quantity: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Amount"
                                type="number"
                                value={newProduct.amount}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, amount: e.target.value })
                                }
                            />
                            <Input
                                placeholder="Payment (Debit/Credit)"
                                value={newProduct.payment}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, payment: e.target.value })
                                }
                            />
                            <Input
                                placeholder="SKU"
                                value={newProduct.SKU}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, SKU: e.target.value })
                                }
                            />
                        </div>
                        <DialogFooter className="mt-2">
                            <Button variant="outline" onClick={() => setAddOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={addProduct}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {products.length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((prod) => (
                                <TableRow key={prod._id}>
                                    <TableCell>{prod.productName}</TableCell>
                                    <TableCell>{categoryMap[prod.category?._id] || 'N/A'}</TableCell>
                                    <TableCell>{prod.quantity}</TableCell>
                                    <TableCell>{prod.amount}</TableCell>
                                    <TableCell>{prod.payment}</TableCell>
                                    <TableCell>{prod.totalAmount || 0}</TableCell>
                                    <TableCell>{prod.balance || 0}</TableCell>
                                    <TableCell className="flex gap-2 justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <IconDotsVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-32">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditProduct(prod)
                                                        setUpdatedProduct(prod)
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setDeleteId(prod._id)}
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p>No products yet</p>
            )}

            {/* Edit Product Dialog */}
            <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                        <Select
                            value={updatedProduct.category?._id || updatedProduct.category || ''}
                            onValueChange={(val) =>
                                setUpdatedProduct({ ...updatedProduct, category: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Product Name"
                            value={updatedProduct.productName || ''}
                            onChange={(e) =>
                                setUpdatedProduct({
                                    ...updatedProduct,
                                    productName: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={updatedProduct.quantity || ''}
                            onChange={(e) =>
                                setUpdatedProduct({
                                    ...updatedProduct,
                                    quantity: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Amount"
                            type="number"
                            value={updatedProduct.amount || ''}
                            onChange={(e) =>
                                setUpdatedProduct({
                                    ...updatedProduct,
                                    amount: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Payment (Debit/Credit)"
                            value={updatedProduct.payment || ''}
                            onChange={(e) =>
                                setUpdatedProduct({
                                    ...updatedProduct,
                                    payment: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="SKU"
                            value={updatedProduct.SKU || ''}
                            onChange={(e) =>
                                setUpdatedProduct({ ...updatedProduct, SKU: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Status"
                            value={updatedProduct.status || ''}
                            onChange={(e) =>
                                setUpdatedProduct({ ...updatedProduct, status: e.target.value })
                            }
                        />
                    </div>
                    <DialogFooter className="mt-2">
                        <Button variant="outline" onClick={() => setEditProduct(null)}>
                            Cancel
                        </Button>
                        <Button onClick={updateProduct}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this product?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProduct(deleteId)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Page