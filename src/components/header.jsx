import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { CgPushRight } from 'react-icons/cg';
import { FaBarsStaggered, FaBell } from 'react-icons/fa6';
import 'react-datepicker/dist/react-datepicker.css';
import { AutoCompletedDropdown } from './AutoCompleteDropdown';
import HeaderDateTime from './HeaderDateTime';
import avatar from '../assets/img/user.png';
import { userService } from '../../service/service';
import HeaderProfleImage from './HeaderProfleImage';
import { Link } from 'react-router-dom';

export default function Header({ hideSideBar, pageName, type }) {
  const [toggleBarIcon, setToggleBarIcon] = useState(false);
  const [notificationCount, setNotificationCount] = useState();

  const [branch, setBranch] = useState({});

  const handleToggle = () => {
    hideSideBar();
    setToggleBarIcon((prev) => !prev);
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await userService.get(
        '/api/v0/web/get_unread_notifications_count'
      );

      if (response.data.valid) {
        setNotificationCount(
          response.data.data[0].get_unread_notifications_count
        );
      }
    } catch (err) {
      console.error('Error fetching SOS data:', err);
    }
  };

  const handleProfile = async () => {
    try {
      const response = await userService.get('/api/v0/web/web_login_profile', {
        login_id: branch,
      });

      if (response.data.valid) {
        const value = response.data.data[0];
        setBranch(value);
      } else {
        console.error('Error in response:', response.data.message);
      }
    } catch (err) {
      console.error('Error while fetching user data:', err);
    }
  };

  // const handleImageChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("login_id", 206);
  //   formData.append("profile_pic", file);

  //   try {
  //     const response = await userService.post("/api/v0/web/update_profile_pic", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.data.valid) {
  //       // Update profile picture in state
  //       setBranch((prev) => ({
  //         ...prev,
  //         profile_pic: response.data.data.profile_pic || avatar,
  //       }));
  //       console.log("Profile picture updated successfully");
  //     } else {
  //       console.error("Error in response:", response.data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error while updating profile picture:", err);
  //   }
  // };

  useEffect(() => {
    handleProfile();
    fetchNotificationCount();
  }, []);

  return (
    <header className={'topheader border-bottom'}>
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          <Col md={4}>
            <div className="d-flex gap-3 align-items-center fs-5">
              <div className={'bar'} onClick={handleToggle}>
                {!toggleBarIcon ? (
                  <FaBarsStaggered size={25} />
                ) : (
                  <CgPushRight size={25} />
                )}
              </div>
              {pageName && (
                <div className="pagename">
                  {pageName}
                  <span>.</span>
                </div>
              )}
            </div>
          </Col>
          <Col
            md={8}
            className="d-flex justify-content-end gap-3 align-items-center"
          >
            {/* <AutoCompletedDropdown
              disabled={
                type === "Admin" ||
                type === "Branch User" ||
                loginType === "branch user" ||
                loginType === "Ops Manager"
              }
              url={"/api/v0/web/web_branch_dropdown"}
              handleDataChange={(val) => {
                // Handle branch data change
              }}
              valueInput={branch.branch_code}
              objLevel={"branch_code"}
              labelName={"Branch Code"}
            />

            <AutoCompletedDropdown
              disabled={type === "Admin" || type === "Ops Manager"}
              url={"/api/v0/web/web_ops_manager_dropdown"}
              handleDataChange={(val) => {
                // Handle OPS manager data change
              }}
              valueInput={branch.emp_code}
              objLevel={"emp_code"}
              labelName={"OPS Manager"}
            /> */}
            <Link
              className="btn btn-light border btn-sm notifybox"
              to="/notifications"
            >
              {notificationCount > 0 && <span>{notificationCount}</span>}
              <FaBell /> Notifcations Count
            </Link>

            <HeaderDateTime />

            <HeaderProfleImage profileData={branch} />
          </Col>
        </Row>
      </Container>

      {/* Hidden File Input for Profile Picture */}
      {/* <input
        type="file"
        id="profilePicUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePdfUpload}
      /> */}
    </header>
  );
}
