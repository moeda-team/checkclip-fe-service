"use client";

import { Key, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomerData, CustomerDataTable } from "@/components/crm/customer-data/CustomerDataTable";

// ── Dummy data ─────────────────────────────────────────────────────────────────

const DUMMY_CUSTOMERS: CustomerData[] = [
  { id: "1",  customerId: "001", fullName: "Jane Doe",        age: 25, gender: "Woman", companyName: "Roam Wild",      jobTitle: "Operator",  email: "janedoe@email.com"      },
  { id: "2",  customerId: "002", fullName: "William Morgan",  age: 30, gender: "Man",   companyName: "Bondi Threads",  jobTitle: "Admin",     email: "williammorgan@email.com"},
  { id: "3",  customerId: "003", fullName: "James Brown",     age: 26, gender: "Man",   companyName: "Cyber Shield",   jobTitle: "HR",        email: "jamesbrown@email.com"  },
  { id: "4",  customerId: "004", fullName: "Alex White",      age: 40, gender: "Man",   companyName: "True Blue Tech", jobTitle: "Technical", email: "alexwhite@email.com"    },
  { id: "5",  customerId: "005", fullName: "Laura Miles",     age: 36, gender: "Woman", companyName: "Game Changer",   jobTitle: "Operator",  email: "lauramiles@email.com"   },
  { id: "6",  customerId: "006", fullName: "Chris Johnson",   age: 28, gender: "Man",   companyName: "Nova Corp",      jobTitle: "Developer", email: "chrisjohnson@email.com" },
  { id: "7",  customerId: "007", fullName: "Sofia Garcia",    age: 33, gender: "Woman", companyName: "Pixel Works",    jobTitle: "Designer",  email: "sofiagarcia@email.com"  },
  { id: "8",  customerId: "008", fullName: "David Lee",       age: 45, gender: "Man",   companyName: "Alpha Media",    jobTitle: "Manager",   email: "davidlee@email.com"     },
  { id: "9",  customerId: "009", fullName: "Emma Wilson",     age: 29, gender: "Woman", companyName: "Bright Path",    jobTitle: "Analyst",   email: "emmawilson@email.com",   },
  { id: "10", customerId: "010", fullName: "Kevin Scott",     age: 38, gender: "Man",   companyName: "Stark Digital",  jobTitle: "CTO",       email: "kevinscott@email.com",   },
  { id: "11", customerId: "011", fullName: "Mia Thompson",    age: 24, gender: "Woman", companyName: "Cloud Nine",     jobTitle: "Intern",    email: "miathompson@email.com",  },
  { id: "12", customerId: "012", fullName: "Ryan Adams",      age: 32, gender: "Man",   companyName: "Iron Logic",     jobTitle: "DevOps",    email: "ryanadams@email.com",    },
  { id: "13", customerId: "013", fullName: "Olivia Brown",    age: 27, gender: "Woman", companyName: "Vibe Studio",    jobTitle: "Marketing", email: "oliviabrown@email.com",  },
  { id: "14", customerId: "014", fullName: "Nathan Clark",    age: 42, gender: "Man",   companyName: "Peak Ventures",  jobTitle: "CEO",       email: "nathanclark@email.com",  },
  { id: "15", customerId: "015", fullName: "Ella Martinez",   age: 31, gender: "Woman", companyName: "Sunrise Labs",   jobTitle: "QA",        email: "ellamartinez@email.com", },
  { id: "16", customerId: "016", fullName: "Lucas Turner",    age: 35, gender: "Man",   companyName: "Wave Systems",   jobTitle: "Scrum",     email: "lucasturner@email.com",  },
  { id: "17", customerId: "017", fullName: "Grace Hall",      age: 23, gender: "Woman", companyName: "Bold Agency",    jobTitle: "Copywriter",email: "gracehall@email.com",    },
  { id: "18", customerId: "018", fullName: "Owen King",       age: 37, gender: "Man",   companyName: "Green Byte",     jobTitle: "Backend",   email: "owenking@email.com",     },
  { id: "19", customerId: "019", fullName: "Chloe Wright",    age: 44, gender: "Woman", companyName: "Spark Media",    jobTitle: "Director",  email: "chloewright@email.com",  },
  { id: "20", customerId: "020", fullName: "Liam Walker",     age: 22, gender: "Man",   companyName: "Code Factory",   jobTitle: "Frontend",  email: "liamwalker@email.com",   },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CustomerDataPage() {
  const router = useRouter();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  // Filter data locally (replace with API call later)
  const filtered = useMemo(() => {
    return DUMMY_CUSTOMERS.filter((c) => {
      const matchSearch =
        !search ||
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.customerId.includes(search);

    //   const matchStatus =
    //     statusFilter === "all" || c.status === statusFilter;

      return matchSearch 
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const handleDelete = (id: string) => {
    // deleteMutation.mutate(id);
    console.log("delete", id);
  };

  const handleRowsPerPageChange = (val: number) => {
    setRowsPerPage(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-light">Customer Profile</h1>
      </div>

      <CustomerDataTable
        data={paginated}
        isLoading={false}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onDelete={handleDelete}
        onAddNew={() => router.push("/crm/customer-data/create")}
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        pagination={{
          paginationDto: {
            total: filtered.length,
            total_pages: totalPages,
          },
          paginationFilter: {
            page: safePage,
            perPage: rowsPerPage,
          },
          setPaginationFilter: ({ page: p }) => setPage(p),
        }}
      />
    </div>
  );
}
