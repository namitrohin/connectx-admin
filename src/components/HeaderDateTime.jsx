import { Box, CircularProgress, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import moment from 'moment';
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  circle: {
    strokeWidth: '4px',
    padding: '10px',
    width: '49px',
    height: '49px',
  },
}));

function CircularProgressWithLabel(props) {
  const classes = useStyles();

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        disableShrink
        size={30}
        variant="determinate"
        {...props}
        classes={{ circle: classes.circle }}
        color={props.color}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#000',
          }}
        >{`${Math.round(props.time)}`}</Typography>
      </Box>
    </Box>
  );
}

export default function HeaderDateTime() {
  const [time, setTime] = useState({
    hrs: moment().format('h'),
    minutes: moment().format('mm'),
    seconds: moment().format('ss'),
    hrsValue: Math.ceil((parseInt(moment().format('h')) * 8 + 1) / 10) * 10,
    minValue: Math.ceil((parseInt(moment().format('mm')) * 2 + 1) / 10) * 10,
    secValue: Math.ceil((parseInt(moment().format('ss')) * 1.6 + 1) / 10) * 10,
  });
  useEffect(() => {
  const calculateTime = () => {
    setInterval(() => {
      setTime({
        ...time,
        hrsValue: Math.ceil((parseInt(moment().format('h')) * 8 + 1) / 10) * 10,
        hrs: moment().format('h'),
        secValue:
          Math.ceil((parseInt(moment().format('ss')) * 1.6 + 1) / 10) * 10,
        seconds: moment().format('ss'),
        minValue:
          Math.ceil((parseInt(moment().format('mm')) * 2 + 1) / 10) * 10,
        minutes: moment().format('mm'),
      });
    }, 1000);
  };
  
    calculateTime();
  }, []);
  return (
    <>
      <div className="datetime_wrapper">
        <div className="datelabel">{moment().format('dddd DD MMM YYYY')}</div>
        <div className="bottom d-flex justify-content-center gap-2">
          <div className="circle_box">
            <CircularProgressWithLabel
              className="hrs"
              value={time.hrsValue}
              time={time.hrs}
              color="success"
            />
          </div>
          <div className="circle_box">
            <CircularProgressWithLabel
              color="secondary"
              value={time.minValue}
              time={time.minutes}
            />
          </div>
          <div className="circle_box">
            <CircularProgressWithLabel
              className="seconds"
              value={time.secValue}
              time={time.seconds}
              color="danger"
            />
          </div>
        </div>
      </div>
    </>
  );
}
