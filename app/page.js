'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDoc, getDocs, setDoc, doc, query, deleteDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { firestore } from "@/public/firebase";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const q = query(collection(firestore, 'pantry'));
    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const incrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      await updateInventory();
    }
  };

  const decrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      await updateInventory();
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = () => {
    if (searchTerm) {
      setInventory((prevInventory) => prevInventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      updateInventory();
    }
  };

  const viewAll = () => {
    setSearchTerm('');
    updateInventory();
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
    >
      <Box
        width="40%" 
        height="80vh" 
        marginTop={20}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f5f5f5"
        borderRight="1px solid #ddd"
        position="relative"
        border="none"
      >
        <Box
          position="absolute"
          top={0}
          textAlign="center"
          transform="translateX(-50%)"
          borderRadius={2}
          zIndex={2}
        >
          <Typography 
            variant="h4" 
            style={{
              color: '#5D3A00', // Darker brown color
              fontFamily: 'Roboto, sans-serif', 
              fontWeight: 'bold', 
              letterSpacing: '0.05em',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(to right, #ffcc99, #ff9966)',
              WebkitBackgroundClip: 'text',
              padding: '20px 20px',
              borderRadius: '8px',
              border: '2px solid #5D3A00',
              display: 'inline-block',
              marginTop: '-30px' // Moves the text up
            }}
          >
            PANTRY TRACKER
          </Typography>
        </Box>
        <Image 
          src="/images/pantry_1.avif" 
          alt="Pantry" 
          layout="fill" 
          objectFit="cover"
        />
      </Box>
      <Box 
        width="calc(100vw - 40%)"
        height="90vh" 
        marginTop="5vh" 
        marginBottom="5vh" 
        marginRight="5vh"
        display="flex" 
        justifyContent="center"
        alignItems="center"
        padding={2}
        border="1px solid black" 
        borderRadius={10}
        sx={{
          backgroundImage: `url('/images/pantry_7.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          width="80%"
          height="80%"
          bgcolor="white"
          padding={2}
          borderRadius={10}
          border={1}
          borderColor="black"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%" 
              left="50%" 
              width={400}
              bgcolor="white" 
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant="h6">Add Item</Typography>
              <Stack width="100%" direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }}
                  sx={{
                    borderRadius: '50%',
                    width: '70px',
                    height: '70px',
                    minWidth: '70px',
                    p: 0,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#00BFAE', // Bold color
                    color: '#fff',
                    fontSize: '24px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.2)', // Enlarge on hover
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Stronger shadow
                    },
                    '&:active': {
                      transform: 'scale(0.9)', // Shrink on click
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Revert shadow
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '300%',
                      height: '300%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light overlay
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%) scale(0)',
                      transition: 'transform 0.3s',
                    },
                    '&:hover::before': {
                      transform: 'translate(-50%, -50%) scale(1)', // Expand overlay on hover
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: '32px' }} />
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                width: '220px', // Width of the rectangle
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #ff4081, #ffab40)', // Vibrant gradient background
                  padding: '10px 20px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '14px', // Smaller font size
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  flexGrow: 1,
                }}
              >
                ADD NEW ITEM
              </Box>
              <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                  position: 'absolute',
                  right: '-20px', // Adjusted to fit properly
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '60px', // Ensured width equals height
                  height: '60px', // Ensured height equals width
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #00bcd4, #8bc34a)', // Vibrant gradient color for the button
                  border: '3px solid #0097a7', // Darker gradient border color
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0097a7, #7cb342)', // Darker gradient on hover
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  },
                  '&:active': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: '24px', color: '#fff' }} /> {/* Centered icon */}
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                width: '320px', // Adjusted width for the container
                padding: '6px', // Reduced padding for a more compact look
                border: '1px solid #ccc', // Updated border color for a subtle look
                borderRadius: '12px', // Added border-radius for a rounded look
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Added shadow for depth
                backgroundColor: '#f9f9f9', // Light background color
                marginRight: '20px', // Added margin to create space from the right side
              }}
            >
              <TextField
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Items"
                sx={{
                  marginRight: '10px', // Space between the text field and the button
                  borderRadius: '8px', // Rounded corners for the text field
                  backgroundColor: '#fff', // White background for the text field
                  '& .MuiOutlinedInput-root': {
                    height: '40px', // Reduced height for the text field
                    '& fieldset': {
                      borderColor: '#ddd', // Subtle border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#bbb', // Darker border on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00bcd4', // Focus border color
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                  width: '40px', // Ensure width is equal to height
                  height: '40px', // Reduced height for the button
                  minWidth: '40px', // Ensure minWidth is equal to height
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #00bcd4, #8bc34a)',
                  border: '3px solid #0097a7',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Softer shadow for depth
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0', // Ensure no additional padding
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0097a7, #7cb342)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)', // Enhanced shadow on hover
                  },
                  '&:active': {
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <SearchIcon sx={{ fontSize: '20px', color: '#fff' }} />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={viewAll}
                sx={{
                  marginLeft: '10px', // Space between search button and view all button
                  width: '200px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #ff4081, #ffab40)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #ff1744, #ff9100)',
                  },
                }}
              >
                View All
              </Button>
            </Box>
          </Box>
          <Box 
            width="100%" 
            bgcolor="white" 
            borderRadius={2} 
            paddingX={2} 
            height="100%" 
            overflow="hidden" // No overflow here
          >
            <Box 
              width="100%" 
              height="calc(100% - 40px)" // Adjust height based on header
              overflow="auto" // Only this box will scroll
            >
              <Stack direction="row" spacing={2} paddingBottom={1} borderBottom="1px solid black">
                <Typography variant="body1" width="10%" textAlign="center" fontWeight="bold">
                  Sr
                </Typography>
                <Typography variant="body1" width="30%" textAlign="center" fontWeight="bold">
                  Item
                </Typography>
                <Typography variant="body1" width="15%" textAlign="center" fontWeight="bold">
                  Quantity
                </Typography>
                <Typography variant="body1" width="30%" textAlign="center" fontWeight="bold">
                  +/- 
                </Typography>
                <Typography variant="body1" width="15%" textAlign="center" fontWeight="bold">
                  Remove
                </Typography>
              </Stack>
              <Stack width="100%" height="auto" spacing={2}>
                {inventory.map(({ name, quantity }, index) => (
                  <Box
                    key={name}
                    width="100%"
                    minHeight="60px"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#f0f0f0"
                    paddingX={2}
                  >
                    <Typography variant="body3" width="10%" textAlign="center">
                      {index + 1}
                    </Typography>
                    <Typography variant="body3" width="30%" textAlign="center">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="body3" width="15%" textAlign="center">
                      {quantity}
                    </Typography>
                    <Stack direction="row" spacing={1} width="30%" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => incrementQuantity(name)}
                        sx={{
                          borderRadius: '50%',
                          minWidth: '30px',
                          width: '30px',
                          height: '30px',
                          p: 0,
                        }}
                      >
                        <ExpandLessIcon />
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => decrementQuantity(name)}
                        sx={{
                          borderRadius: '50%',
                          minWidth: '30px',
                          width: '30px',
                          height: '30px',
                          p: 0,
                        }}
                      >
                        <ExpandMoreIcon />
                      </Button>
                    </Stack>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => removeItem(name)}
                      sx={{
                        borderRadius: '50%',
                        minWidth: '30px',
                        width: '30px',
                        height: '30px',
                        p: 0,
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
