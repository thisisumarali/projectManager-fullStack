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

export default function InvoiceCard() {
  const [invoices, setInvoices] = useState([]);
  const [addOpen, setAddOpen] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editInvoice, setEditInvoice] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const addInvoice = async () => {
    if (!invoiceNumber || !client || !amount || !dueDate) {
      return toast.error("All fields are required");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          InvoiceNumber: parseInt(invoiceNumber),
          Client: client,
          Amount: parseFloat(amount),
          PaidAmount: parseFloat(paidAmount || 0),
          DueDate: dueDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      toast.success("Invoice added");
      setAddOpen(false);
      setInvoiceNumber("");
      setClient("");
      setAmount("");
      setPaidAmount("");
      setDueDate("");
      fetchInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateInvoice = async () => {
    if (!editInvoice) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/invoice/${editInvoice._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            InvoiceNumber: parseInt(editInvoice.Invoice),
            Client: editInvoice.Client,
            Amount: parseFloat(editInvoice.Amount),
            PaidAmount: parseFloat(editInvoice.PaidAmount || 0),
            DueDate: editInvoice.DueDate,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      toast.success("Invoice updated");
      setEditInvoice(null);
      fetchInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/invoice/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      toast.success("Invoice deleted");
      setDeleteId(null);
      fetchInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center px-6 py-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage your invoices easily</CardDescription>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Invoice</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Invoice Number"
                  type="number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
                <Input
                  placeholder="Client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                />
                <Input
                  placeholder="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  placeholder="Paid Amount"
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addInvoice}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.length ? (
                  invoices.map((inv) => (
                    <TableRow key={inv._id}>
                      <TableCell>{inv.Invoice}</TableCell>
                      <TableCell>{inv.Client}</TableCell>
                      <TableCell>{inv.Amount}</TableCell>
                      <TableCell>{inv.PaidAmount || 0}</TableCell>
                      <TableCell>
                        {inv.Amount - (inv.PaidAmount || 0)}
                      </TableCell>
                      <TableCell>{inv.Status}</TableCell>
                      <TableCell>
                        {new Date(inv.Date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(inv.DueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => setEditInvoice(inv)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => setDeleteId(inv._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No invoices found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editInvoice} onOpenChange={() => setEditInvoice(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>

          {editInvoice && (
            <div className="space-y-3">
              <Input
                placeholder="Invoice Number"
                type="number"
                value={editInvoice.Invoice}
                onChange={(e) =>
                  setEditInvoice({ ...editInvoice, Invoice: e.target.value })
                }
              />
              <Input
                value={editInvoice.Client}
                onChange={(e) =>
                  setEditInvoice({ ...editInvoice, Client: e.target.value })
                }
              />
              <Input
                type="number"
                value={editInvoice.Amount}
                onChange={(e) =>
                  setEditInvoice({ ...editInvoice, Amount: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Paid Amount"
                value={editInvoice.PaidAmount || 0}
                onChange={(e) =>
                  setEditInvoice({ ...editInvoice, PaidAmount: e.target.value })
                }
              />
              <Input
                type="date"
                value={editInvoice.DueDate?.split("T")[0]}
                onChange={(e) =>
                  setEditInvoice({ ...editInvoice, DueDate: e.target.value })
                }
              />
              <Input
                type="text"
                value={new Date(editInvoice.Date).toLocaleDateString()}
                disabled
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditInvoice(null)}>
              Cancel
            </Button>
            <Button onClick={updateInvoice}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteInvoice(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
