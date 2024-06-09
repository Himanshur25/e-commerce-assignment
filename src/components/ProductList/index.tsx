import React, { useContext, useEffect, useState } from "react";
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
  Button,
  CircularProgress,
  Slider,
} from "@mui/material";
import { Clear, SearchOutlined, AddShoppingCart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GlobalContext, IGlobalContext } from "../providers/GlobalProvider";

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

export default function ColumnGroupingTable() {
  const { showAlert } = useContext(GlobalContext) as IGlobalContext;

  const [data, setData] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedText, setSearchedText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortOption, setSortOption] = useState<string>("");
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });

    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(currentCart.length);
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

  const handlePriceRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
  };

  const handleSortOptionChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value as string);
  };

  const addToCart = (product: Data) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...currentCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItemCount(updatedCart.length);
    showAlert({
      message: "Item Added to cart Successfully",
      type: "success",
    });
  };

  const filteredData = data
    .filter((item) => {
      const matchesTitle = item.title
        .toLowerCase()
        .includes(searchedText.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesPriceRange =
        item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesTitle && matchesCategory && matchesPriceRange;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "popularity":
          return b.rating.count - a.rating.count;
        default:
          return 0;
      }
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cart")}
          sx={{ marginBottom: 2, float: "right" }}
        >
          Go to Cart ({cartItemCount})
        </Button>
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

        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: 180, marginLeft: 2 }}
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortOptionChange}
            label="Sort By"
          >
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <FormControl sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Typography
              gutterBottom
              sx={{
                width: 200,
              }}
            >
              Price Range
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              max={1000}
            />
          </FormControl>
        </Box>
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
                <TableCell align="right" style={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/product/${row.id}`)}
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
                        <TableCell align="right">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(row);
                            }}
                          >
                            <AddShoppingCart />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
