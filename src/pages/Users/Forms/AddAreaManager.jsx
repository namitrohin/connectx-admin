/* eslint-disable no-prototype-builtins */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Box, Grid2, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { userService } from '../../../../service/service';
import { AutoCompletedDropdown } from '../../../components/AutoCompleteDropdown';
import { useDispatch, useSelector } from 'react-redux';
import SuccessMessage from '../../../components/SuccessMessage';
import { toggleSpinnerAndDisableButton } from '../../../Redux/Modals';
import config from '../../../../service/config';

function AddAreaManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const RowData = location.state;
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    p_action: 'INSERT',
    area_manager_id: 26,
    ops_manager_id: 66,
    emp_code: '',
    full_name: '',
    mobile: '',
    email: '',
    profile_pic: '',
    branch_id: null,
    branch_code: '',
    p_branch_manager_id: null,
    ops_manager_emp_code: '',
    branch_manager_emp_code: '',
    ops_manager_name: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emp_code) newErrors.emp_code = 'Employee Code is required';
    if (!formData.full_name) newErrors.full_name = 'Full Name is required';
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.p_mobile = 'Enter a 10-digit mobile number';
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
    const formDataWithIntegers = {
      ...formData,
      // created_by: +formData.created_by || 0,
      // updated_by: +formData.updated_by || 0,
      ops_manager_id: +formData.ops_manager_id || 0,
      branch_id: +formData.branch_id || 0,
    };

    try {
      const response = await userService.post(
        '/api/v0/web/web_area_manager_manage',
        formDataWithIntegers
      );
      if (response.status === 200 && response.data.status !== 400) {
        setShowSuccess(true);
        setFormData({
          p_action: 'INSERT',
          area_manager_id: 26,
          ops_manager_id: 66,
          emp_code: '',
          full_name: '',
          mobile: '',
          email: '',
          profile_pic: '',
          branch_id: null,
        });
        dispatch(toggleSpinnerAndDisableButton(false));
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/users/area-manager');
        }, 1000);
      } else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePdfUpload = async (files) => {
    const data = new FormData();
    data.append(`file_path`, files.target.files[0]);

    try {
      await userService
        .uploadImage('/api/v0/app/areaManager', data)
        .then((result) => {
          if (result.data.valid) {
            setFormData({ ...formData, profile_pic: result.data.data.path });
          }
        })
        .catch((err) => {});
    } catch (err) {}
  };

  const handleRemoveAttachment = () => {
    setFormData({ ...formData, profile_pic: null });
  };

  const handleEdit = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_area_manager_preview',
        {
          area_manager_id: RowData.id,
          p_action: 'UPDATE',
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
        tempData.p_action = 'UPDATE';
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

  return (
    <MainLayout pageName="Add Area Manager" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/users/area-manager">
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
                <Col md={4}>
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
                <Col md={4}>
                  <AutoCompletedDropdown
                    disabled={RowData?.type === 'preview'}
                    url={'/api/v0/web/web_branch_manager_dropdown'}
                    body={{
                      p_search: '',
                      p_limit: 10,
                      branch_id: formData.branch_id,
                    }}
                    handleDataChange={(val) => {
                      setFormData({
                        ...formData,
                        branch_manager_id: val.user_id,
                        branch_manager_emp_code: val.emp_code,
                      });
                    }}
                    valueInput={formData.branch_manager_emp_code}
                    objLevel={'emp_code'}
                    labelName={'Branch Manager'}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <AutoCompletedDropdown
                    disabled={RowData?.type === 'preview'}
                    url={'/api/v0/web/web_ops_manager_dropdown'}
                    handleDataChange={(val) => {
                      setFormData({
                        ...formData,
                        ops_manager_id: val.ops_manager_id,
                        ops_manager_emp_code: val.emp_code,
                        ops_manager_name: val.ops_manager_name,
                      });
                    }}
                    body={{
                      p_limit: 10,
                      p_branch_manager_id: formData.p_branch_manager_id,
                    }}
                    valueInput={formData.ops_manager_emp_code}
                    objLevel={'emp_code'}
                    labelName={'OPS Manager'}
                  />
                </Col>

                <Col md={4} className="mt-4">
                  <Form.Control
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

export default AddAreaManager;
