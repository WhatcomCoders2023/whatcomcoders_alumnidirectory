import '../../styles/theme.css';
import '../../styles/userInfo.css';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';

const apiUrl = process.env.REACT_APP_API_URL;

const UserInfo = ({ defaultEmail = '', defaultPicture = '' }) => {
  const { userName } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState(defaultEmail);

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [personalWebsiteUrl, setPersonalWebsiteUrl] = useState('');

  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(defaultPicture);

  const [calendlyUrl, setCalendlyUrl] = useState(''); // TODO: add calendly url to database
  const [referral, setReferral] = useState(false);
  const [mentoring, setMentoring] = useState(false);
  const [coffeeChat, setCoffeeChat] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${apiUrl}/api/user`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data) {
          setName(data.name);
          setEmail(data.email);
          setCompany(data.company);
          setJobTitle(data.jobTitle);
          setLinkedinUrl(data.linkedinUrl);
          setGithubUrl(data.githubUrl);
          setPersonalWebsiteUrl(data.personalWebsiteUrl);
          setDescription(data.description);
          setPicture(data.picture);
          setCalendlyUrl(data.calendlyUrl);
          setReferral(data.referral || false);
          setMentoring(data.mentoring || false);
          setCoffeeChat(data.coffeeChat || false);
        }
      } catch (error) {
        console.log('Failed to fetch user profile:', error);
      }
    }
    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    const data = {
      name,
      email,
      company,
      jobTitle,
      linkedinUrl,
      githubUrl,
      personalWebsiteUrl,
      description,
      picture,
      calendlyUrl,
      referral,
      mentoring,
      coffeeChat,
    };
    console.log(data);

    try {
      const response = await fetch(`${apiUrl}/api/people/update`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        setTimeout(() => setNotification(null), 3000); // hides notification after 3 seconds        console.log("Data saved successfully"); //redirect user to another page later
      } else {
        console.log('Failed to save data', await response.text());
        setNotification({
          type: 'error',
          message: 'Failed to update profile.',
        });
      }
    } catch (error) {
      console.error('There was an error:', error);
      setNotification({
        type: 'error',
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='user-info-container' style={{ marginTop: '30px' }}>
      <div className='input-group'>
        <img
          className='profile-picture'
          src={picture}
          alt='User'
          style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        />
        <input
          className='file-input'
          type='file'
          onChange={(e) => setPicture(URL.createObjectURL(e.target.files[0]))}
        />
        <input
          className='text-input'
          type='text'
          placeholder={userName || 'Name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='text-input'
          type='text'
          placeholder='Company'
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        ></input>
        <input
          className='text-input'
          type='text'
          placeholder='Job Title'
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        ></input>
        <input
          className='text-input'
          type='text'
          placeholder='LinkedIn URL'
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
        ></input>
        <input
          className='text-input'
          type='text'
          placeholder='Github URL'
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        ></input>
        <input
          className='text-input'
          type='text'
          placeholder='Personal Website URL'
          value={personalWebsiteUrl}
          onChange={(e) => setPersonalWebsiteUrl(e.target.value)}
        ></input>
        <input
          className='text-input'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className='text-input'
          type='text'
          placeholder='Calendly URL'
          value={calendlyUrl}
          onChange={(e) => setCalendlyUrl(e.target.value)}
        />
        <textarea
          className='text-area'
          placeholder="Write your bio int the 3rd person. Include: What your're doing now. Past Experiences/Accomplishments. Something fun and personal. (at least 300 chars please)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {/* <ProjectTagsField name='tags' options={[]} /> */}

      <div className='checkbox-group'>
        {[
          {
            state: referral,
            setState: setReferral,
            label: 'Would you be willing to give referrals?',
          },
          {
            state: mentoring,
            setState: setMentoring,
            label: 'Are you open to mentoring others?',
          },
          {
            state: coffeeChat,
            setState: setCoffeeChat,
            label: 'Are you open to coffee chats with people?',
          },
        ].map((item, index) => (
          <div key={index} className='checkbox-item'>
            <label>
              <input
                type='checkbox'
                checked={item.state}
                onChange={(e) => item.setState(e.target.checked)}
              />
              {item.label}
            </label>
          </div>
        ))}
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <button
        className={`submit-button ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
      >
        {loading ? <span className='loading-spinner'></span> : null} Update
        Profile
      </button>
    </div>
  );
};

export default UserInfo;
