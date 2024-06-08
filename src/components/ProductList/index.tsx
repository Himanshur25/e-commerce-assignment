import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  OutlinedInput,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import { Clear, SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface Column {
  id: "title" | "price" | "description" | "category" | "rating" | "image";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: "image", label: "Image", minWidth: 170 },
  { id: "title", label: "Title", minWidth: 170 },
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    align: "right",
    format: (value: number) =>
      value.toLocaleString("en-US", { style: "currency", currency: "USD" }),
  },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "category", label: "Category", minWidth: 170 },
  {
    id: "rating",
    label: "Rating",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toFixed(1),
  },
];

interface Data {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: { rate: number; count: number };
  image: string;
}

export default function ProductList() {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedText, setSearchedText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchText = (text: string) => {
    setSearchedText(text);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  const filteredData = data.filter((item) => {
    const matchesTitle = item.title
      .toLowerCase()
      .includes(searchedText.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesTitle && matchesCategory;
  });

  return (
    <Box sx={{ margin: 4 }}>
      <Typography
        variant="h4"
        component="div"
        align="center"
        gutterBottom
        sx={{ marginBottom: 4 }}
      >
        Product Fetching Information
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            width: 180,
          }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="All">All</MenuItem>
            {Array.from(new Set(data.map((item) => item.category))).map(
              (category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <OutlinedInput
          placeholder="Search"
          value={searchedText}
          size="small"
          onChange={(event) => handleSearchText(event.target.value)}
          startAdornment={<SearchOutlined fontSize="small" />}
          endAdornment={
            <IconButton onClick={() => setSearchedText("")}>
              <Clear fontSize="small" />
            </IconButton>
          }
        />
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "bold" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() => navigate(`/product/${row.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => {
                        const value =
                          column.id === "rating"
                            ? row.rating.rate
                            : row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "image" ? (
                              <img
                                src={row.image}
                                alt={row.title}
                                style={{ width: 50, height: 50 }}
                              />
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
