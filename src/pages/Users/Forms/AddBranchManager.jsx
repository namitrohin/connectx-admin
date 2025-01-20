import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { userService } from '../../../../service/service';
import { AutoCompletedDropdown } from '../../../components/AutoCompleteDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSpinnerAndDisableButton } from '../../../Redux/Modals';
import SuccessMessage from '../../../components/SuccessMessage';
import config from '../../../../service/config';

function AddBranchManager() {
  const [showSuccess, setShowSuccess] = useState(false);
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const RowData = location.state;
  const [formData, setFormData] = useState({
    operation: 'insert',
    emp_code: '',
    full_name: '',
    mobile: '',
    email: '',
    profile_pic: '',
    branch_id: null,
    type: 'User',
    branch_code: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emp_code.trim())
      newErrors.emp_code = 'Employee code is required.';
    if (!formData.full_name.trim())
      newErrors.full_name = 'Full name is required.';
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Valid 10-digit mobile number is required.';
    if (
      !formData.email.trim() ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    )
      newErrors.email = 'Valid email address is required.';
    // if (!formData.p_branch_id.trim()) newErrors.p_branch_id = "Branch selection is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const insertForm = async () => {
    dispatch(toggleSpinnerAndDisableButton(true));
    if (!validateForm()) {
      dispatch(toggleSpinnerAndDisableButton(false));
      return;
    }

    try {
      const response = await userService.post(
        '/api/v0/web/web_user_branch_manage',
        formData
      );
      if (response.status === 200) {
        if (response.data.status === 400) {
          alert('Found Duplicate Entries');
          return;
        } else {
          setShowSuccess(true);
          setFormData({
            operation: 'insert',
            emp_code: '',
            full_name: '',
            mobile: '',
            email: '',
            profile_pic: '',
            branch_id: null,
            type: 'User',
          });
          dispatch(toggleSpinnerAndDisableButton(false));
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/users/branch-manager');
          }, 1200);
        }
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(toggleSpinnerAndDisableButton(false));
    }
  };

  const handleChangeFormData = (event) => {
    const { name, value } = event.target;

    // Allow only numeric input and limit to 10 digits for mobile number
    if (name === 'p_mobile' && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleEdit = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_user_branch_preview',
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
        .uploadImage('/api/v0/app/branchUser', data)
        .then((result) => {
          if (result.data.valid) {
            setFormData({ ...formData, profile_pic: result.data.data.path });
          }
        })
        .catch((err) => { });
    } catch (err) { }
  };
  const handleRemoveAttachment = () => {
    setFormData({ ...formData, profile_pic: null });
  };

  return (
    <MainLayout pageName="Add Branch Users" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/users/branch-manager">
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
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    value={formData.full_name}
                    name="full_name"
                    onChange={handleChangeFormData}
                    error={!!errors.pull_name}
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
                    value={formData.mobile}
                    name="mobile"
                    onChange={handleChangeFormData}
                    inputProps={{ maxLength: 10 }}
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
                    value={formData.email}
                    name="email"
                    onChange={handleChangeFormData}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Col>
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
                <Col md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      disabled={RowData?.type === 'preview'}
                      value={formData.type}
                      label="Type"
                      onChange={handleChangeFormData}
                      size="small"
                      name="type"
                    >
                      <MenuItem value="User">User</MenuItem>
                      <MenuItem value="Manager">Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
                <Col md={4} className="mt-4">
                  <AutoCompletedDropdown
                    disabled={RowData?.type === 'preview'}
                    url={'/api/v0/web/web_branch_dropdown'}
                    handleDataChange={(val) => {
                      setFormData({
                        ...formData,
                        branch_id: val.branch_id,
                        branch_code: val.branch_code,
                      });
                    }}
                    valueInput={formData.branch_code}
                    objLevel={'branch_code'}
                    labelName={'Branch Code'}
                  />
                </Col>
                {RowData?.type !== 'preview' && (
                  <Col md={12}>
                    <Button
                      size="sm"
                      F
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

export default AddBranchManager;
