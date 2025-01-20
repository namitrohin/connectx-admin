import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { TextField } from '@mui/material';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../../../../service/service';
import { AutoCompletedDropdown } from '../../../components/AutoCompleteDropdown';

function AddCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    p_action: 'INSERT',
    p_customer_id: 1,
    p_customer_code: '',
    p_company_name: '',
    p_display_name: '',
    p_address: '',
    p_city: '',
    p_pin: null,
    p_state: '',
    p_country: '',
    p_pan: '',
    p_gstin: '',
    p_customer_group_id: 11,
    p_contact_person: '',
    p_mobile: '',
    p_email: '',
    p_branch_id: null,
    branch: '',
  });

  const handleChangeFormData = (event) => {
    const { name, value } = event.target;

    // Convert empty strings for integer fields to null
    setFormData({
      ...formData,
      [name]:
        value === '' &&
        [
          'p_customer_id',
          'p_pin',
          'p_customer_group_id',
          'p_branch_id',
          'p_created_by',
          'p_updated_by',
        ].includes(name)
          ? null
          : value,
    });
  };

  const insertForm = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_customer_manage',
        formData
      );

      if (response.data.valid) {
        // alert('Customer added successfully.');
        setFormData({
          p_action: 'INSERT',
          p_customer_id: 1,
          p_customer_code: '',
          p_company_name: '',
          p_display_name: '',
          p_address: '',
          p_city: '',
          p_pin: null,
          p_state: '',
          p_country: '',
          p_pan: '',
          p_gstin: '',
          p_customer_group_id: 11,
          p_contact_person: '',
          p_mobile: '',
          p_email: '',
          p_branch_id: 13,
        });

        navigate('/customers/customer');
      } else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <MainLayout pageName="Customer" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/customers/customer">
            <MdOutlineKeyboardBackspace /> Go Back
          </Link>
        </div>
        <Form>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={4} className="mb-4">
                  {/* Form fields */}
                  <AutoCompletedDropdown
                    labelName={'Branch Code'}
                    url={'/api/v0/web/web_branch_dropdown'}
                    handleDataChange={
                      (value) =>
                        setFormData({
                          ...formData,
                          p_branch_id: value.branch_id,
                          branch: value?.branch_code,
                        })
                      // handleFilterChange(
                      //   'branch',
                      //   value?.branch_code,
                      //   'branch_id',
                      //   value.branch_id
                      // )
                    }
                    valueInput={formData.branch}
                    objLevel={'branch_code'}
                  />
                </Col>
                <Col md={4} className="mb-4">
                  <TextField
                    size="small"
                    label="Customer Code"
                    variant="outlined"
                    fullWidth
                    name="p_customer_code"
                    value={formData.p_customer_code}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Company Name"
                    variant="outlined"
                    fullWidth
                    name="p_company_name"
                    value={formData.p_company_name}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Display Name"
                    variant="outlined"
                    fullWidth
                    name="p_display_name"
                    value={formData.p_display_name}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4}>
                  <TextField
                    size="small"
                    label="Contact Person"
                    variant="outlined"
                    fullWidth
                    name="p_contact_person"
                    value={formData.p_contact_person}
                    onChange={handleChangeFormData}
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
                    required
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    name="p_address"
                    value={formData.p_address}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="City"
                    variant="outlined"
                    fullWidth
                    name="p_city"
                    value={formData.p_city}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="Pin"
                    variant="outlined"
                    fullWidth
                    name="p_pin"
                    value={formData.p_pin}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="State"
                    variant="outlined"
                    fullWidth
                    name="p_state"
                    value={formData.p_state}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    name="p_country"
                    value={formData.p_country}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="Pan"
                    variant="outlined"
                    fullWidth
                    name="p_pan"
                    value={formData.p_pan}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={4} className="mt-4">
                  <TextField
                    size="small"
                    label="GSTIN"
                    variant="outlined"
                    fullWidth
                    name="p_gstin"
                    value={formData.p_gstin}
                    onChange={handleChangeFormData}
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

export default AddCustomer;
