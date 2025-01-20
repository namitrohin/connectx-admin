/* eslint-disable no-prototype-builtins */
import { Button, Col, Container, Form, Row , Spinner} from 'react-bootstrap';
import MainLayout from '../../../components/MainLayout';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userService } from '../../../../service/service';
import DatePicker from 'react-datepicker';
import { AutoCompletedDropdown } from '../../../components/AutoCompleteDropdown';
import { useDispatch,useSelector } from 'react-redux';
import { toggleSpinnerAndDisableButton } from '../../../Redux/Modals';
import SuccessMessage from '../../../components/SuccessMessage';
function AddGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  //added start
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  //added end
  const RowData = location.state;
  const [formData, setFormData] = useState({
    p_action: 'INSERT',
    guard_id: 1,
    // p_emp_code: "",
    // p_full_name: "",

    designation_id: null,
    gender: '',
    marital_status: '',
    mobile: '',
    email: '',
    father_name: '',
    date_of_joining: new Date(),
    date_of_leaving: new Date(),
    date_of_birth: new Date(),
    date_of_entry: new Date(),
    date_of_approval: new Date(),
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    pf_branch: '',
    pf_no: '',
    esi_branch: '',
    esi_no: '',
    pf_deduct: false,
    pt_deduct: false,
    esi_deduct: false,
    address: '',
    city: '',
    state: '',
    country: '',
    pin: '',
    p_address: '',
    p_city: '',
    p_state: '',
    p_country: '',
    uan_no: '',
    adhar_no: '',
    pan_no: '',
    p_pin: '',
    customer_id: 15,
    emp_status: null,
    sahyog_member: false,
    branch_manager_id: null,
    branch_manager: '',
    ops_manager_id: null,
    area_manager_id: null,
    area_manager_name: '',
    profile_pic: '',
    customer_code: '',
    company_name: '',
    full_name: '',
    designation: '',
    emp_code: '',
    branch_manager_name: '',
    ops_manager_name: '',
  });
//added start
const validateForm = () => {
  const newErrors = {};

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



//added end
  const handleChangeFormData = (event) => {
    const { name, type, value, checked } = event.target;
    //added
    if (name === 'p_mobile' && value.length > 10) return;
  
    
    //added end
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEdit = async () => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_guard_preview',
        {
          guard_id: RowData.id,
          p_action: 'UPDATE',
        }
      );
      if (response.data.valid) {
        const value = response.data.data[0];
        let tempData = { ...formData };
        for (let key in formData) {
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

  const insertForm = async () => {
  //added
    dispatch(toggleSpinnerAndDisableButton(true));
    if (!validateForm()) {
      dispatch(toggleSpinnerAndDisableButton(false));
      return;
    }
  //addedend
    try {
      const response = await userService.post(
        '/api/v0/web/web_master_guard_manage',
        formData
      );

      if (response.data.valid) {
        setFormData({});
        // navigate('/guards/guards');
        //added start
        dispatch(toggleSpinnerAndDisableButton(false));
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/guards/guards');
        }, 1000);
      }else {
        alert(response.data.message || 'Found Duplicate Entries');
      }
      //added end
    } catch (err) {
      console.error('Error in insertForm:', err);
    }
  };

  const handleDateChange = (field, date) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  useEffect(() => {
    if (RowData?.id) {
      handleEdit();
    } else {
      // alert('Guard ID Missing');
    }
  }, [RowData?.id]);

  return (
    <MainLayout pageName="Guards Entry" hasAddButton={false}>
      <Container className="formwrapper mt-0" fluid>
        <div className="d-flex justify-content-end w-100 mb-3">
          <Link className="backlink" to="/guards/guards">
            <MdOutlineKeyboardBackspace /> Go Back
          </Link>
        </div>
        <Form>
          <Row>
            <Col md={12}>
              <div className="bg-light p-4 border rounded-3 mb-4 pb-0 ">
                <Row>
                  <Col md={12}>
                    <h6 className="mb-3 text-uppercase">Guard Details</h6>
                  </Col>
                  <Row>
                    <Col md={4} className="mb-4">
                      <TextField
                        disabled={RowData?.type === 'preview'}
                        size="small"
                        label="Employee Code"
                        variant="outlined"
                        fullWidth
                        name="emp_code"
                        value={formData.emp_code}
                        onChange={handleChangeFormData}
                      />
                    </Col>
                    <Col md={4} className="mb-4">
                      <TextField
                        disabled={RowData?.type === 'preview'}
                        size="small"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChangeFormData}
                      />
                    </Col>

                    <Col md={4} className="mb-4">
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Gender</InputLabel>
                        <Select
                          disabled={RowData?.type === 'preview'}
                          label="Gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChangeFormData}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                    <Col md={4} className="mb-4">
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel>Marital Status</InputLabel>
                        <Select
                          disabled={RowData?.type === 'preview'}
                          label="Marital status"
                          name="marital_status"
                          value={formData.marital_status}
                          onChange={handleChangeFormData}
                        >
                          <MenuItem value="Single">Single</MenuItem>
                          <MenuItem value="Married">Married</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                    <Col md={4} className="mb-4">
                      <AutoCompletedDropdown
                        disabled={RowData?.type === 'preview'}
                        url={'/api/v0/web/web_guard_designation_dropdown'}
                        handleDataChange={(val) => {
                          setFormData({
                            ...formData,
                            p_designation_id: val.designation_id,
                            designation: val.designation,
                          });
                        }}
                        valueInput={formData.designation}
                        objLevel={'designation'}
                        labelName={'Guard Designation'}
                      />
                    </Col>
                    <Col md={4} className="mb-4">
                      <TextField
                        disabled={RowData?.type === 'preview'}
                        size="small"
                        label="Mobile"
                        variant="outlined"
                        fullWidth
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChangeFormData}
                        //added start
                        error={!!errors.mobile}
                        helperText={errors.mobile}
                        //added end
                      />
                    </Col>
                    <Col md={4} className="mb-4">
                      <TextField
                        disabled={RowData?.type === 'preview'}
                        size="small"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleChangeFormData}
                        //added start
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        //added end
                      />
                    </Col>

                    <Col md={4} className="mb-4">
                      <TextField
                        disabled={RowData?.type === 'preview'}
                        size="small"
                        label="Father Name"
                        variant="outlined"
                        fullWidth
                        name="father_name"
                        value={formData.father_name}
                        onChange={handleChangeFormData}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <AutoCompletedDropdown
                        disabled={RowData?.type === 'preview'}
                        url={'/api/v0/web/web_customer_dropdown'}
                        body={{
                          p_search: '',
                          p_limit: 10,
                        }}
                        handleDataChange={(val) => {
                          setFormData({
                            ...formData,
                            customer_id: val.customer_id,
                            p_customer_id: val.customer_id,
                            customer_code: val.customer_code,
                            company_name: val.company_name,
                          });
                        }}
                        valueInput={formData.company_name}
                        objLevel={'company_name'}
                        labelName={'Customer'}
                      />
                    </Col>
                    <Col md={4} className="mb-4">
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
                            user_id: val.p_branch_manager_id,
                            branch_manager_id: val.user_id,
                            branch_manager_name: val.emp_code,
                          });
                        }}
                        valueInput={formData.branch_manager_name}
                        objLevel={'emp_code'}
                        labelName={'Branch Manager'}
                      />
                    </Col>
                    <Col md={4} className="mb-4">
                      <AutoCompletedDropdown
                        disabled={RowData?.type === 'preview'}
                        url={'/api/v0/web/web_ops_manager_dropdown'}
                        handleDataChange={(val) => {
                          setFormData({
                            ...formData,
                            ops_manager_id: val.ops_manager_id,
                            ops_manager_name: val.emp_code,
                          });
                        }}
                        valueInput={formData.ops_manager_name}
                        objLevel={'emp_code'}
                        labelName={'OPS Manager'}
                      />
                    </Col>

                    <Col md={4} className="mb-4">
                      <AutoCompletedDropdown
                        disabled={RowData?.type === 'preview'}
                        url={'/api/v0/web/web_area_manager_dropdown'}
                        handleDataChange={(val) => {
                          setFormData({
                            ...formData,
                            // p_branch_manager_id: val.area_manager_id,
                            area_manager_id: val.area_manager_id,
                            area_manager_name: val.emp_code,
                          });
                        }}
                        valueInput={formData.area_manager_name}
                        objLevel={'emp_code'}
                        labelName={'Area Manager'}
                      />
                    </Col>
                  </Row>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <div className="bg-light p-4 border rounded-3 mb-4 pb-0">
                <Row>
                  <Col md={12}>
                    <h6 className="mb-3 text-uppercase">Current Address</h6>
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Address "
                      variant="outlined"
                      fullWidth
                      name="address"
                      value={formData.address}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="City"
                      variant="outlined"
                      fullWidth
                      name="city"
                      value={formData.city}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="State"
                      variant="outlined"
                      fullWidth
                      name="state"
                      value={formData.state}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
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

                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Country"
                      variant="outlined"
                      fullWidth
                      name="country"
                      value={formData.country}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <div className="bg-light p-4 border rounded-3 mb-4 pb-0">
                <Row>
                  <Col md={12}>
                    <h6 className="mb-3 text-uppercase">Permanent Address</h6>
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Permanent Address"
                      variant="outlined"
                      fullWidth
                      name="p_address"
                      value={formData.p_address}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Permanent City"
                      variant="outlined"
                      fullWidth
                      name="p_city"
                      value={formData.p_city}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Permanent State"
                      variant="outlined"
                      fullWidth
                      name="p_state"
                      value={formData.p_state}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Pin"
                      variant="outlined"
                      fullWidth
                      name="p_pin"
                      value={formData.p_pin}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Permanent Country"
                      variant="outlined"
                      fullWidth
                      name="p_country"
                      value={formData.p_country}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={12}>
              <div className="bg-light p-4 border rounded-3 mb-4 pb-0 ">
                <Row>
                  <Col md={4} className="d-flex align-items-center gap-2 mb-4">
                    <div className="dateselect">
                      <span>Date of Joining</span>
                      <DatePicker
                        disabled={RowData?.type === 'preview'}
                        selected={formData.date_of_joining}
                        onChange={(date) =>
                          handleDateChange('date_of_joining', date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="rounded-1 formdatepicker"
                      />
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center gap-2 mb-4">
                    <div className="dateselect">
                      <span>Date of Leaving</span>
                      <DatePicker
                        disabled={RowData?.type === 'preview'}
                        selected={formData.date_of_leaving}
                        onChange={(date) =>
                          handleDateChange('date_of_leaving', date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="rounded-1 formdatepicker"
                      />
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center gap-2 mb-4">
                    <div className="dateselect">
                      <span>Date of Birth</span>
                      <DatePicker
                        showMonthDropdown
                        showYearDropdown
                        scrollableMonthYearDropdown
                        scrollableYearDropdown
                        disabled={RowData?.type === 'preview'}
                        selected={formData.date_of_birth}
                        onChange={(date) =>
                          handleDateChange('date_of_birth', date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="rounded-1 formdatepicker"
                        maxDate={new Date()}
                      />
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center gap-2 mb-4">
                    <div className="dateselect">
                      <span>Date of Entry</span>
                      <DatePicker
                        disabled={RowData?.type === 'preview'}
                        selected={formData.date_of_entry}
                        onChange={(date) =>
                          handleDateChange('date_of_entry', date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="rounded-1 formdatepicker"
                      />
                    </div>
                  </Col>
                  <Col md={4} className="d-flex align-items-center gap-2 mb-4">
                    <div className="dateselect">
                      <span>Date of Approval</span>
                      <DatePicker
                        disabled={RowData?.type === 'preview'}
                        selected={formData.date_of_approval}
                        onChange={(date) =>
                          handleDateChange('date_of_approval', date)
                        }
                        dateFormat="dd/MM/yyyy"
                        className="rounded-1 formdatepicker"
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={12}>
              <div className="bg-light p-4 border rounded-3 mb-4 pb-0 ">
                <Row>
                  <Col md={12}>
                    <h6 className="mb-3 text-uppercase">Bank Details</h6>
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Bank Name"
                      variant="outlined"
                      fullWidth
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Account No."
                      variant="outlined"
                      fullWidth
                      name="account_no"
                      value={formData.account_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="IFSC Code"
                      variant="outlined"
                      fullWidth
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="PF Branch"
                      variant="outlined"
                      fullWidth
                      name="pf_branch"
                      value={formData.pf_branch}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="PF No."
                      variant="outlined"
                      fullWidth
                      name="pf_no"
                      value={formData.pf_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="ESI Branch"
                      variant="outlined"
                      fullWidth
                      name="esi_branch"
                      value={formData.esi_branch}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="ESI No."
                      variant="outlined"
                      fullWidth
                      name="esi_no"
                      value={formData.esi_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="UAN"
                      variant="outlined"
                      fullWidth
                      name="uan_no"
                      value={formData.uan_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="Adhar No."
                      variant="outlined"
                      fullWidth
                      name="adhar_no"
                      value={formData.adhar_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                  <Col md={4} className="mb-4">
                    <TextField
                      disabled={RowData?.type === 'preview'}
                      size="small"
                      label="PAN No."
                      variant="outlined"
                      fullWidth
                      name="pan_no"
                      value={formData.pan_no}
                      onChange={handleChangeFormData}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={12}>
              <div className="border rounded-3 p-3 pb-3 bg-light mb-4">
                <Row>
                  <Col md={2} className=" d-flex align-items-center gap-2 ">
                    <Checkbox
                      disabled={RowData?.type === 'preview'}
                      checked={formData.pf_deduct}
                      onChange={handleChangeFormData}
                      name="pf_deduct"
                      color="primary"
                    />
                    <label>PF Deducted</label>
                  </Col>
                  <Col md={2} className=" d-flex align-items-center gap-2 ">
                    <Checkbox
                      disabled={RowData?.type === 'preview'}
                      checked={formData.pt_deduct}
                      onChange={handleChangeFormData}
                      name="pt_deduct"
                      color="primary"
                    />
                    <label>PT Deducted</label>
                  </Col>
                  <Col md={2} className=" d-flex align-items-center gap-2 ">
                    <Checkbox
                      disabled={RowData?.type === 'preview'}
                      checked={formData.esi_deduct}
                      onChange={handleChangeFormData}
                      name="esi_deduct"
                      color="primary"
                    />
                    <label>ESI Deducted</label>
                  </Col>
                  <Col md={2} className=" d-flex align-items-center gap-2 ">
                    <Checkbox
                      disabled={RowData?.type === 'preview'}
                      checked={formData.sahyog_member}
                      onChange={handleChangeFormData}
                      name="sahyog_member"
                      color="primary"
                    />
                    <label>Sahyog Member.</label>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col md={12} className="mb-4">
              <Form.Control
                disabled={RowData?.type === 'preview'}
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
            </Col>

            <Col md={12}>
              <Button
                size="sm"
                variant="none"
                type="button"
                className="commonBtn "
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
          </Row>
        </Form>
      </Container>
    <SuccessMessage hidden={showSuccess} />
    </MainLayout>
  );
}

export default AddGuard;