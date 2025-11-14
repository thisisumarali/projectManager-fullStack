"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash, Plus } from "lucide-react";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    company: "",
    productName: "",
    quantity: "",
    amount: "",
    payment: "Debit",
    category: "",
    status: "pending",
    SKU: "",
  });

  const [updatedProduct, setUpdatedProduct] = useState({});
  const token = localStorage.getItem("token");

  // Fetch products, companies, categories
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
      console.log("fetch products", data.products);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCompanies(data.companies || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCompanies();
    fetchCategories();
  }, []);

  // Maps for quick lookup
  const companyMap = Object.fromEntries(
    companies.map((c) => [String(c._id), c.companyName])
  );
  const categoryMap = Object.fromEntries(
    categories.map((c) => [String(c._id), c.name])
  );

  // Add product
  const addProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to add product");
      toast.success("Product added successfully!");
      setNewProduct({
        company: "",
        productName: "",
        quantity: "",
        amount: "",
        payment: "Debit",
        category: "",
        status: "pending",
        SKU: "",
      });
      setAddOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Update product
  const updateProduct = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/${editProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update product");
      toast.success("Product updated!");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to delete");
      toast.success("Product deleted!");
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center px-6 py-6">
      <Card className="w-full max-w-6xl ">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage products with company, category & financial details
            </CardDescription>
          </div>

          {/* Add Product Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <IconPlus />
                <span className="hidden lg:inline">Add Section</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <Select
                  value={newProduct.company}
                  onValueChange={(val) =>
                    setNewProduct({ ...newProduct, company: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
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
        </CardHeader>

        {/* Products Table */}
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead>Product</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">{` `}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length ? (
                  products.map((prod) => (
                    <TableRow key={prod._id}>
                      <TableCell>{prod.productName}</TableCell>
                      <TableCell>
                        {prod.company?.companyName || "N/A"}
                      </TableCell>
                      <TableCell>{prod.category?.name || "N/A"}</TableCell>
                      <TableCell>{prod.quantity}</TableCell>
                      <TableCell>
                        {prod.amount
                          ? Number(prod.amount).toLocaleString()
                          : "0"}
                      </TableCell>
                      <TableCell>{prod.payment}</TableCell>
                      <TableCell>
                        {prod.totalAmount
                          ? Number(prod.totalAmount).toLocaleString()
                          : "0"}
                      </TableCell>
                      <TableCell>
                        {prod.balance
                          ? Number(prod.balance).toLocaleString()
                          : "0"}
                      </TableCell>

                      <TableCell className="flex gap-2 justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                              size="icon"
                            >
                              <IconDotsVertical />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditProduct(prod);
                                setUpdatedProduct(prod); // prefill edit form
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
                            <DropdownMenuItem>Favorite</DropdownMenuItem> 
                            <DropdownMenuSeparator />*/}
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteId(prod._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Edit Button
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditProduct(prod);
                            setUpdatedProduct(prod); // prefill edit form
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        {/* <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(prod._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>{" "}
                        */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Edit Product Dialog */}
        <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-2">
              <Select
                value={updatedProduct.company || ""}
                onValueChange={(val) =>
                  setUpdatedProduct({ ...updatedProduct, company: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={updatedProduct.category || ""}
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
                value={updatedProduct.productName || ""}
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
                value={updatedProduct.quantity || ""}
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
                value={updatedProduct.amount || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    amount: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Payment (Debit/Credit)"
                value={updatedProduct.payment || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    payment: e.target.value,
                  })
                }
              />
              <Input
                placeholder="SKU"
                value={updatedProduct.SKU || ""}
                onChange={(e) =>
                  setUpdatedProduct({ ...updatedProduct, SKU: e.target.value })
                }
              />
              <Input
                placeholder="Status"
                value={updatedProduct.status || ""}
                onChange={(e) =>
                  setUpdatedProduct({
                    ...updatedProduct,
                    status: e.target.value,
                  })
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
      </Card>
    </div>
  );
}
