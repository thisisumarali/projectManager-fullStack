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

export default function CompanyCard() {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    contact: "",
    address: "",
  });
  const [editCompany, setEditCompany] = useState(null);
  const [updatedCompany, setUpdatedCompany] = useState({
    companyName: "",
    contact: "",
    address: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch companies for this user
  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCompanies(data.companies || []);
      else toast.error(data.msg || "Failed to fetch companies");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Add company
  const addCompany = async () => {
    if (!newCompany.companyName.trim())
      return toast.error("Enter company name!");
    try {
      const res = await fetch("http://localhost:5000/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCompany),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to add company");
      toast.success("Company added successfully!");
      setNewCompany({ companyName: "", contact: "", address: "" });
      setAddOpen(false);
      fetchCompanies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Update company
  const updateCompany = async () => {
    if (!updatedCompany.companyName.trim())
      return toast.error("Enter company name!");
    try {
      const res = await fetch(
        `http://localhost:5000/api/company/${editCompany._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCompany),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update company");
      toast.success("Company updated!");
      setEditCompany(null);
      fetchCompanies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete company
  const deleteCompany = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/company/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to delete company");
      toast.success("Company deleted!");
      setDeleteId(null);
      fetchCompanies();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center px-6 py-10">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Companies</CardTitle>
            <CardDescription>Manage your companies</CardDescription>
          </div>

          {/* Add Company Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Company Name"
                  value={newCompany.companyName}
                  onChange={(e) =>
                    setNewCompany({
                      ...newCompany,
                      companyName: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Contact"
                  value={newCompany.contact}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, contact: e.target.value })
                  }
                />
                <Input
                  placeholder="Address"
                  value={newCompany.address}
                  onChange={(e) =>
                    setNewCompany({ ...newCompany, address: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addCompany}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length ? (
                  companies.map((comp) => (
                    <TableRow
                      key={comp._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{comp.companyName}</TableCell>
                      <TableCell>{comp.contact}</TableCell>
                      <TableCell>{comp.address}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditCompany(comp);
                            setUpdatedCompany({
                              companyName: comp.companyName,
                              contact: comp.contact,
                              address: comp.address,
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => setDeleteId(comp._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No companies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Edit Dialog */}
        <Dialog open={!!editCompany} onOpenChange={() => setEditCompany(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Company Name"
                value={updatedCompany.companyName}
                onChange={(e) =>
                  setUpdatedCompany({
                    ...updatedCompany,
                    companyName: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Contact"
                value={updatedCompany.contact}
                onChange={(e) =>
                  setUpdatedCompany({
                    ...updatedCompany,
                    contact: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Address"
                value={updatedCompany.address}
                onChange={(e) =>
                  setUpdatedCompany({
                    ...updatedCompany,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditCompany(null)}>
                Cancel
              </Button>
              <Button onClick={updateCompany}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this company?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteCompany(deleteId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
