import MainLayout from '../components/MainLayout';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Form, Link, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { userService } from '../../service/service';
import SuccessMessage from '../components/SuccessMessage';

function AddBranch() {
  const location = useLocation();
  const navigate = useNavigate();
  const RowData = location.state;
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    operation: 'insert',
    branch_code: '',
    address: '',
    city: '',
    state: '',
    country: '',
    gstin: '',
    pin: '',
    pan: '',
  });

  const insertForm = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_branch_manage',
        formData
      );
      if (response.status === 200) {
        if (response.data.status === 400) {
          alert('Found Duplicate Entries');
          return;
        } else {
          setFormData({
            operation: 'insert',
            branch_code: '',
            address: '',
            city: '',
            state: '',
            country: '',
            gstin: '',
            pin: '',
            pan: '',
          });
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/branch');
          }, 1200);
        }
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleChangeFormData = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleEdit = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_branch_preview',
        {
          branch_id: RowData.id,
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
  return (
    <MainLayout pageName="Add Branch" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/branch">
            <MdOutlineKeyboardBackspace /> Go Back
          </Link>
        </div>
        <Form>
          <Row>
            <Col md={12}>
              {/* <img
                src="https://api.connectx.co.in/public/guard/rn_image_picker_lib_temp_e44dbf7d-736b-4015-91cb-7c3e0a77c2df-1733828772628.jpg"
                className="w-100"
                alt="sdfsadf"
              /> */}
              <Row>
                <Col md={3} className="mb-4 validate">
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Branch Code"
                    variant="outlined"
                    fullWidth
                    name="branch_code"
                    value={formData.branch_code}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={formData.address}
                    name="address"
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={formData.city}
                    name="city"
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Pin"
                    variant="outlined"
                    fullWidth
                    name="pin"
                    value={formData.pin}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={formData.state}
                    name="state"
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={formData.country}
                    name="country"
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="Pan"
                    variant="outlined"
                    fullWidth
                    name="pan"
                    value={formData.pan}
                    onChange={handleChangeFormData}
                  />
                </Col>
                <Col md={3}>
                  <TextField
                    disabled={RowData?.type === 'preview'}
                    size="small"
                    label="GSTIN"
                    variant="outlined"
                    fullWidth
                    value={formData.gstin}
                    name="gstin"
                    onChange={handleChangeFormData}
                  />
                </Col>
                {RowData?.type !== 'preview' && (
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

export default AddBranch;
