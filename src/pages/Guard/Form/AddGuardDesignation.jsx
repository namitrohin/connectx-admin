import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import { TextField } from '@mui/material';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userService } from '../../../../service/service';

function AddGuardDesignation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    p_action: 'INSERT',
    p_designation_id: 1,
    p_designation: '',
  });
  const handleChangeFormData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const insertForm = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_guard_designation_manage',
        formData
      );
      if (response.status === 200 && response.data.status !== 400) {
        setFormData({
          p_action: 'INSERT',
          p_designation_id: 1,
          p_designation: '',
        });
        navigate('/guards/guard-designation');
      } else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout pageName="Guard Designation" hasAddButton={false}>
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
                    label="Customer Code"
                    variant="outlined"
                    fullWidth
                    name="p_designation"
                    value={formData.p_designation}
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

export default AddGuardDesignation;
