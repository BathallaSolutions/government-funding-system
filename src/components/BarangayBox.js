import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Man from '../assets/man.png';
import Badge from '@mui/material/Badge';
import InfoIcon from '@mui/icons-material/Info';

const BarangayBox = ({ data }) => {
  return (
    <Card sx={{ padding: 0.5, backgroundColor: '#fff', border: '1px solid' }}>
        {/* fcd216 - yellow */}
        {/* 0038a8 - blue */}
        {data.isRequesting &&
          <div 
            className="animate__animated animate__heartBeat animate__infinite infinite" 
            style={{position:'absolute', zIndex: 9999, top: -1, right: -1, fontSize:5, }}
          >
            <Badge badgeContent={<InfoIcon fontSize="small" style={{color:'yellow'}}/>} >
            </Badge>
          </div>
        }
        <Box className="animate__animated animate__bounceIn" style={{ position: 'relative', display: 'flex' }}>
          <img
            className="m-auto" 
            style={{ width: 30, margin: 'auto' }} 
            src={Man} 
            alt="man" 
          />
          <Typography
            sx={{ 
              fontSize: 7, 
              position: 'absolute', 
              bottom: 0, 
              fontWeight: 'bold', 
              textTransform: 'capitalize', 
              backgroundColor: '#fff', 
              borderRadius: 1, 
              lineHeight: 1 
            }} 
            color='text.secondary'
          >
            {data.name}
          </Typography>
        </Box>
        <Box 
          style={{ border: '1px solid', borderRadius: 2, textAlign: 'center', padding: '0.125rem', backgroundColor: 'white'}} 
        >
          <Typography sx={{ fontSize: 9, lineHeight: 1 }} color='text.secondary'>
            Brgy. {data.number}
          </Typography>
        </Box>
    </Card>
  );
}
export default BarangayBox