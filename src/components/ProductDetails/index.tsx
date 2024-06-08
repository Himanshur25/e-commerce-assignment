import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Container,
  Grid,
  Rating,
} from "@mui/material";

interface Data {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  rating: { rate: number; count: number };
  image: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Data>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h4">Product not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              alt={product.title}
              // height="400"
              image={product.image}
              title={product.title}
              sx={{ objectFit: "contain", padding: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" component="div">
                {product.title}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ marginY: 2 }}
              >
                ${product.price}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                Category: {product.category}
              </Typography>
              <Box display="flex" alignItems="center">
                <Rating value={product.rating.rate} precision={0.1} readOnly />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginLeft: 1 }}
                >
                  ({product.rating.count} reviews)
                </Typography>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ProductDetails;
