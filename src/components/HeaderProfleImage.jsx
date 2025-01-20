import { useEffect, useRef, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { userService } from '../../service/service';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/img/user.png';
import config from '../../service/config';

// eslint-disable-next-line react/prop-types
function HeaderProfleImage({ profileData }) {
  // const userefData = useRef(5676);
  // userefData.current = profileData;
  const [branch, setBranch] = useState({
    profile_pic: '',
    name: '',
  });
  const navigate = useNavigate();
  const handlePdfUpload = async (files) => {
    const data = new FormData();
    data.append(`file_path`, files.target.files[0]);

    try {
      await userService
        .uploadImage('/api/v0/web/update_profile_pic', data)
        .then((result) => {
          if (result.data.valid) {
            // setBranch({ ...branch, profile_pic: result.data.data.path });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setBranch(profileData);
  }, [profileData]);

  const handleRemoveAttachment = () => {
    setBranch({ ...branch, profile_pic: null });
  };
  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
    window.location.reload();
  };
  return (
    <>
      <div className="headerRightProfile">
        <div className="profilePicUpload">
          <img
            src={`${config.nodeUrl}/${branch.profile_pic}`}
            className="user_profile"
            alt="User Avatar"
            style={{ cursor: 'pointer' }}
          />
          <Form.Control size="md" type="file" onChange={handlePdfUpload} />
        </div>
        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            className="profile-dropdown"
            variant="none"
          >
            {/* {branch.profile_pic && (
              <div className="d-flex align-items-center gap-3 mt-3">
                <a
                  href={`${config.nodeUrl}/${branch.profile_pic}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dark"
                  style={{ fontSize: '13px' }}
                >
                  {branch.profile_pic}
                </a>
                <span
                  className="border pt-3 pb-3 p-2 lh-0 cursor-pointer"
                  onClick={handleRemoveAttachment}
                >
                  x
                </span>
              </div>
            )} */}
            <span className="user_name">{branch?.name}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Link className="dropdown-item" to="/my-account">
              My Account
            </Link>
            <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
            <li className="dropdown-item" onClick={handleLogout}>
              Logout
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default HeaderProfleImage;
