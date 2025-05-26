import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const BoxComponent = (amount) => {
  const [selectedItems1, setSelectedItems1] = useState([]);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [number, setNumber] = useState(0);

  const handleItemClick1 = (item) => {
    console.log(amount)
    if (selectedItems1.includes(item)) {
      setSelectedItems1(selectedItems1.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems1([...selectedItems1, item]);
    }
    setNumber(selectedItems2.length + (selectedItems1.includes(item) ? -1 : 1));
  };

  const handleDropdownChange = (event) => {
    setSelectedItems2(event.target.value);
    setNumber(selectedItems1.length + event.target.value.length);
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="center" >
    <Box display="flex" flexDirection="column" alignItems="center" marginRight={2} justifyContent="center">
        <h2>Code: {amount.code}</h2>
       
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
        <h2>Previous Exams</h2>
        <ul>
          <li>
            <Button variant={selectedItems1.includes('Item 1') ? 'contained' : 'outlined'} onClick={() => handleItemClick1('Item 1')}>
              Item 1
            </Button>
          </li>
          <li>
            <Button variant={selectedItems1.includes('Item 2') ? 'contained' : 'outlined'} onClick={() => handleItemClick1('Item 2')}>
              Item 2
            </Button>
          </li>
          <li>
            <Button variant={selectedItems1.includes('Item 3') ? 'contained' : 'outlined'} onClick={() => handleItemClick1('Item 3')}>
              Item 3
            </Button>
          </li>
        </ul>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" marginRight={2}>
        <h2>All Questions</h2>
        <FormControl>
          <InputLabel id="select-label">Select Items</InputLabel>
          <Select labelId="select-label" multiple value={selectedItems2} onChange={handleDropdownChange} renderValue={(selected) => selected.join(', ')}>
            <MenuItem value="Item 1">Item 1</MenuItem>
            <MenuItem value="Item 2">Item 2</MenuItem>
            <MenuItem value="Item 3">Item 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <h2>Max: {amount.amount}</h2>
        <TextField label="Total" value={number} variant="outlined" disabled />
      </Box>
    </Box>
  );
};

export default BoxComponent;
