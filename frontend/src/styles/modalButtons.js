import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { green, red } from '@mui/material/colors';

export const buttonStyle = (isHover) => ({
	padding: '0.5rem',
	hover: '#6c63ff50',
	color: '#ffffff',
	outline: 'none',
	border: 'none',
	borderRadius: '1rem',
	fontSize: '1rem',
	fontWeight: 500,
	cursor: 'pointer',
	transition: '0.2s',
	width: 150,
	backgroundColor: isHover ? '#4640ad' : '#6c63ff',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
});

export const modalStyle = {
	display: 'flex',
	flexDirection: 'column',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	maxWidth: '90%',
	width: '600px',
	padding: '2rem',
	maxHeight: '90vh',
	overflow: 'auto',
};

export const SubmitButton = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(green[500]),
	backgroundColor: green[400],
	'&:hover': {
		backgroundColor: green[700],
	},
}));

export const CancelButton = styled(Button)(({ theme }) => ({
	color: theme.palette.getContrastText(red[500]),
	backgroundColor: red[500],
	'&:hover': {
		backgroundColor: red[700],
	},
}));
