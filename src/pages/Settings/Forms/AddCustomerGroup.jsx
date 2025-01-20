import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { TextField } from '@mui/material';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../../../../service/service';

function AddCustomerGroup() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    operation: 'insert',
    p_emp_code: '',
    p_customer_group_id: 1,
    p_mobile: '',
    p_email: '',
    p_profile_pic: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.p_emp_code)
      newErrors.p_emp_code = 'Employee Code is required';
    if (!formData.p_full_name) newErrors.p_full_name = 'Full Name is required';
    if (!/^\d{10}$/.test(formData.p_mobile))
      newErrors.p_mobile = 'Enter a 10-digit mobile number';
    if (!formData.p_email) {
      newErrors.p_email = 'Email is required';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.p_email)
    ) {
      newErrors.p_email = 'Enter a valid email address';
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
    if (!validateForm()) return;

    try {
      const response = await userService.post(
        '/api/v0/web/web_user_admin_manage',
        formData
      );
      if (response.status === 200 && response.data.status !== 400) {
        setFormData({
          operation: 'insert',
          p_emp_code: '',
          p_full_name: '',
          p_mobile: '',
          p_email: '',
          p_profile_pic: '',
        });
        navigate('/users/admin');
      } else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout pageName="Grouped Customer" hasAddButton={false}>
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
                    size="small"
                    label="Employee Code"
                    variant="outlined"
                    fullWidth
                    name="p_emp_code"
                    value={formData.p_emp_code}
                    onChange={handleChangeFormData}
                    error={!!errors.p_emp_code}
                    helperText={errors.p_emp_code}
                    required
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="p_full_name"
                    value={formData.p_full_name}
                    onChange={handleChangeFormData}
                    error={!!errors.p_full_name}
                    helperText={errors.p_full_name}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    name="p_mobile"
                    value={formData.p_mobile}
                    onChange={handleChangeFormData}
                    error={!!errors.p_mobile}
                    helperText={errors.p_mobile}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="p_email"
                    value={formData.p_email}
                    onChange={handleChangeFormData}
                    error={!!errors.p_email}
                    helperText={errors.p_email}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    size="md"
                    type="file"
                    name="p_profile_pic"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        p_profile_pic: e.target.files[0],
                      })
                    }
                  />
                </Col>
                <Col md={12}>
                  <Button
                    size="sm"
                    variant="none"
                    type="button"
                    className="commonBtn mt-4"
                    onClick={insertForm}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    </MainLayout>
  );
}

export default AddCustomerGroup;
