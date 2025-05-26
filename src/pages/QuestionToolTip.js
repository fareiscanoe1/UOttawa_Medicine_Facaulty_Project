import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PreviewIcon from '@mui/icons-material/Preview';

const QuestionToolTip = ({ rowData }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const handleIconClick = (event) => {
    setTooltipData({
      EnglishQuestion: rowData.questionEnglish,
      FrenchQuestion: rowData.questionFrench,
    });

    // Set the position based on the click event
    setTooltipPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const closeTooltip = () => {
    // Close the tooltip by resetting the data and position
    setTooltipData(null);
  };

  return (
    <>
      <Tooltip placement="top" onClose={closeTooltip}>
        <IconButton onClick={handleIconClick}>
          <PreviewIcon />
        </IconButton>
      </Tooltip>
      {tooltipData && (
        <Tooltip
          open={Boolean(tooltipData)}
          onClose={closeTooltip}
          title={
            <div style={{ fontSize: '16px' }}>
              {/* Adjust font size as needed */}
              <p>English Question: {tooltipData.EnglishQuestion}</p>
              <p>French Question: {tooltipData.FrenchQuestion}</p>
              {/* Add more details as needed */}
            </div>
          }
          placement="bottom"
        >
          {/* Empty div for proper positioning */}
          <div style={{ position: 'fixed', top: tooltipPosition.top - 10, left: tooltipPosition.left + 150 }} />
        </Tooltip>
      )}
    </>
  );
};

export default QuestionToolTip;
