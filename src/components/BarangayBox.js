import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Man from '../assets/man.png';

const BarangayBox = ({ data }) => {
  return (
    <Card sx={{ padding: 1, backgroundColor: '#749bf6' }}>
        <Box style={{ position: 'relative', display: 'flex' }}>
          <img
            className="m-auto" 
            style={{ width: 50, margin: 'auto' }} 
            src={Man} 
            alt="man" 
          />
          <Typography
            sx={{ 
              fontSize: 14, 
              position: 'absolute', 
              bottom: 0, 
              fontWeight: 'bold', 
              textTransform: 'capitalize', 
              backgroundColor: '#749bf6', 
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
          <Typography sx={{ fontSize: 14 }} color='text.secondary'>
            Barangay {data.number}
          </Typography>
        </Box>
    </Card>
  );
}
export default BarangayBox