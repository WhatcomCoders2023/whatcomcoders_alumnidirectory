import React from 'react';
import { Avatar, Box, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import MailIcon from '@mui/icons-material/Mail';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UserMedia from 'views/profiles/UserMedia';
import UserInfoDialog from './UserInfoDialogWrapper';
// import UserMedia from './UserMedia';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(22),
  height: theme.spacing(22),
  border: `6px solid ${theme.palette.background.paper}`,
}));

// const UserInfoSection = ({ name, role, company }) => (
//   <Stack>
//     <Typography variant='h1' fontWeight={'bold'}>
//       {name}
//     </Typography>
//     <Typography fontWeight={'medium'}>
//       {role} at {company}
//     </Typography>
//   </Stack>
// );

const UserBanner = ({
  name,
  role,
  company,
  avatarUrl,
  data,
  emailReachOutCount,
}) => {
  return (
    <Stack
      direction='row'
      spacing={2}
      sx={{
        mt: -5,
        mb: 10,
      }}
    >
      <ProfileAvatar src={avatarUrl} />
      <Stack sx={{ width: '100%' }}>
        <Box sx={{ height: 70 }} />
        <Stack
          direction='row'
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Name, Roles and Socials*/}
          <Stack>
            <Typography variant='h1' fontWeight={'bold'}>
              {name}
            </Typography>
            <Typography fontWeight={'medium'}>
              {role} at {company}
            </Typography>
            <UserMedia data={data} />
            Number of email reach outs left: {emailReachOutCount}
          </Stack>

          {/* Buttons to meet */}
          <Stack direction='row' spacing={2} sx={{ height: 50 }}>
            <UserInfoDialog />
            {/* <Button variant='outlined' size='medium'>
              Edit Profile
            </Button> */}
            {/* {data.calendlyUrl && (
              <Button
                variant='outlined'
                size='medium'
                startIcon={<CalendarMonthIcon />}
                href={data.calendlyUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                Meet me!
              </Button>
            )} */}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserBanner;
