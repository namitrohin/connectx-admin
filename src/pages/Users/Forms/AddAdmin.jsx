import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { TextField } from '@mui/material';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userService } from '../../../../service/service';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSpinnerAndDisableButton } from '../../../Redux/Modals';
import SuccessMessage from '../../../components/SuccessMessage';
import config from '../../../../service/config';

function AddAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const RowData = location.state;
  console.log('RowData', RowData);
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    operation: 'insert',
    emp_code: '',
    full_name: '',
    mobile: '',
    email: '',
    profile_pic: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emp_code) newErrors.emp_code = 'Employee Code is required';
    if (!formData.full_name) newErrors.full_name = 'Full Name is required';
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Enter a 10-digit mobile number';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangeFormData = (event) => {
    const { name, value } = event.target;

    if (name === 'p_mobile' && value.length > 10) return;

    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const insertForm = async () => {
    dispatch(toggleSpinnerAndDisableButton(true));
    if (!validateForm()) {
      dispatch(toggleSpinnerAndDisableButton(false));
      return;
    }

    try {
      const response = await userService.post(
        '/api/v0/web/web_user_admin_manage',
        formData
      );
      if (response.status === 200 && response.data.status !== 400) {
        setShowSuccess(true);
        setFormData({
          operation: 'insert',
          emp_code: '',
          full_name: '',
          mobile: '',
          email: '',
          profile_pic: '',
        });
        dispatch(toggleSpinnerAndDisableButton(false));
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/users/admin');
        }, 1000);
      } else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(toggleSpinnerAndDisableButton(false));
    }
  };

  const handleEdit = async () => {
    console.log('rowdata', RowData);
    try {
      const response = await userService.post(
        '/api/v0/web/web_user_admin_preview',
        {
          user_id: RowData.id,
          operation: 'update',
        }
      );

      if (response.data.valid) {
        const value = response.data.data[0];
        let tempData = { ...formData };

        for (let key in tempData) {
          if (value.hasOwnProperty(key)) {
            tempData[key] = value[key];
          }
        }
        tempData.operation = 'update';
        setFormData(tempData);
      } else {
        console.log('Error in response:', response.data.message);
      }
    } catch (err) {
      console.error('Error while fetching Guard data:', err);
    }
  };

  useEffect(() => {
    if (RowData?.id) {
      handleEdit();
    } else {
      // setFormData((prev) => ({ ...prev, operation: "insert" }));
    }
  }, [RowData?.id]);

  const handlePdfUpload = async (files) => {
    const data = new FormData();
    data.append(`file_path`, files.target.files[0]);

    try {
      await userService
        .uploadImage('/api/v0/app/admin', data)
        .then((result) => {
          console.log(result);
          if (result.data.valid) {
            setFormData({ ...formData, profile_pic: result.data.data.path });
            console.log(setFormData);
          }
        })
        .catch((err) => {});
    } catch (err) {}
  };

  const handleRemoveAttachment = () => {
    setFormData({ ...formData, profile_pic: null });
  };
  return (
    <MainLayout pageName="Admin Entry" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/users/admin">
            <MdOutlineKeyboardBackspace /> Go Back
          </Link>
        </div>
        <Form>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={4} className="mb-4 validate">
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Employee Code"
                    variant="outlined"
                    fullWidth
                    name="emp_code"
                    value={formData.emp_code}
                    onChange={handleChangeFormData}
                    error={!!errors.emp_code}
                    helperText={errors.emp_code}
                    required
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChangeFormData}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChangeFormData}
                    error={!!errors.mobile}
                    helperText={errors.mobile}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChangeFormData}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Col>
                {/* <Col md={4}>
                  <Form.Control
                    size="md"
                    type="file"
                    name="profile_pic"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile_pic: e.target.files[0],
                      })
                    }
                  />
                </Col> */}
                <Col md={4}>
                  <Form.Control
                    disabled={RowData?.type === 'preview'}
                    size="md"
                    type="file"
                    onChange={handlePdfUpload}
                    // disabled={RowData?.type === "Preview"}
                  />
                  {formData.profile_pic && (
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <a
                        href={`${config.nodeUrl}/${formData.profile_pic}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dark"
                        style={{ fontSize: '13px' }}
                      >
                        {formData.profile_pic}
                      </a>
                      <span
                        className="border pt-3 pb-3 p-2 lh-0 cursor-pointer"
                        onClick={handleRemoveAttachment}
                      >
                        x
                      </span>
                    </div>
                  )}
                </Col>
                {RowData?.type !== 'preview' && (
                  <Col md={12}>
                    <Button
                      size="sm"
                      variant="none"
                      type="button"
                      className="commonBtn mt-4"
                      onClick={insertForm}
                      disabled={spinnerButton}
                    >
                      {spinnerButton ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
      <SuccessMessage hidden={showSuccess} />
    </MainLayout>
  );
}

export default AddAdmin;
