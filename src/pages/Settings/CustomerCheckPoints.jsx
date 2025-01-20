import { useMemo, useState } from 'react';
import { Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideModal,
  showModal,
  toggleForm,
  toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import DeleteModal from '../../components/DeleteModal';
import CommonDataGrid from '../../components/CommonDataGrid';
import MainLayout from '../../components/MainLayout';
import { userService } from '../../../service/service';
import ModalComponent from '../../components/ModalComponent';
import { AutoCompletedDropdown } from '../../components/AutoCompleteDropdown';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import moment from 'moment';
import { MdOutlineEdit } from 'react-icons/md';
import SuccessMessage from '../../components/SuccessMessage';
import { FaPrint } from 'react-icons/fa';
import config from '../../../service/config';

export default function CustomerCheckPoints() {
  const dispatch = useDispatch();
  const addButton = useSelector((state) => state.addFormButton.show);
  const spinnerButton = useSelector(
    (state) => state.toggleSpinnerAndDisableButton.show
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [formTitle, setFormTitle] = useState('Add Customer CheckPoints');

  const [body, setbody] = useState({
    refresh: '',
  });
  const [updateGrid, setupdateGrid] = useState(0);
  const initialValues = {
    action: 'INSERT',
    checkpoint_id: 85,
    checkpoint_code: '',
    qrcode: '',
    customer_id: null,
    scan_interval: 2,
    allowed_delay: 15,
    company_name: '',
    customer_code: '',
    area: '',
    customer_name: '',
  };

  const [formValues, setFormValues] = useState(initialValues);

  const deleteMessage = useSelector((state) => state.removeModal.message);

  const deleteModalData = {
    id: deleteMessage?.checkpoint_id,
    name: deleteMessage?.qrcode,
  };

  async function handleDelete(id) {
    const obj = {
      p_checkpoint_id: id,
    };
    try {
      const response = await userService.post(
        '/api/v0/web/issue_category_delete',
        obj
      );
      if (response.data.valid) {
        setShowSuccess(true);
        setbody({
          ...body,
          refresh: 2,
        });
        dispatch(toggleSpinnerAndDisableButton(false));
        setTimeout(() => {
          setShowSuccess(false);
        }, 1700);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(hideModal());
  }

  const handleClose = () => {
    setFormTitle('Add Customer CheckPoints');
    setFormValues(initialValues);
    dispatch(toggleForm());
  };

  const handleEdit = async (data) => {
    dispatch(toggleForm());
    setFormTitle('Edit Customer CheckPoints');
    try {
      const response = await userService.post(
        '/api/v0/web/web_checkpoint_print',
        { p_checkpoint_id: data.original.checkpoint_id }
      );
      if (response.data.valid) {
        let value = response.data.data[0];
        const editData = {};
        let tempData = { ...formValues };
        for (let key in formValues) {
          if (value.hasOwnProperty(key)) {
            tempData[key] = value[key];
          }
        }
        setFormValues(tempData);
        console.log(tempData);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  // const insertForm = async () => {
  //   dispatch(toggleSpinnerAndDisableButton(true));

  //   const updatedInputValues = {
  //     ...formValues,
  //     p_allowed_delay: Number(formValues.allowed_delay),
  //     p_created_by: 2,
  //   };

  //   try {
  //     const response = await userService.post(
  //       "/api/v0/web/web_checkpoint_manage",
  //       updatedInputValues
  //     );
  //     if (response.status === 200) {
  //       if (response.data.status === 400) {
  //         alert(response.data.message || "Found Duplicate Entries");
  //         dispatch(toggleSpinnerAndDisableButton(false));
  //         return;
  //       } else {
  //         setFormValues(initialValues);
  //       }
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     dispatch(toggleForm());
  //     dispatch(toggleSpinnerAndDisableButton(false));
  //     setShowSuccess(true);
  //     setTimeout(() => {
  //       setShowSuccess(false);
  //     }, 1200);
  //   }
  // };

  const insertForm = async () => {
    dispatch(toggleSpinnerAndDisableButton(true));

    const updatedInputValues = {
      ...formValues,
      p_allowed_delay: Number(formValues.allowed_delay),
      p_created_by: 2,
    };

    try {
      const response = await userService.post(
        '/api/v0/web/web_checkpoint_manage',
        updatedInputValues
      );
      if (response.status === 200) {
        if (response.data.status === 400) {
          alert(response.data.message || 'Found Duplicate Entries');
          dispatch(toggleSpinnerAndDisableButton(false));
          return;
        } else {
          setFormValues(initialValues);
          setbody({
            ...body,
            refresh: body.refresh + 1,
          });
        }
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(toggleForm());
      dispatch(toggleSpinnerAndDisableButton(false));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1200);
    }
  };

  const handleQrCodeChange = (event) => {
    const value = event.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      qrcode: value,
      checkpoint_code: value,
    }));
  };

  const gridColumn = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'S.No.',
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => Number(row.id) + 1,
        size: 90,
      },
      {
        accessorKey: 'checkpoint_code',
        header: 'Customer Checkpoint',
        enableColumnFilter: false,
        size: 200,
      },
      {
        accessorKey: 'company_name',
        header: 'Company Name',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'qrcode',
        header: 'Qr Code ',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'scan_interval',
        header: 'Scan Interval (HRS.) ',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'allowed_delay',
        header: 'Delay Time(MINS.)',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'area',
        header: 'Area',
        enableColumnFilter: false,
        size: 270,
      },
      {
        accessorKey: 'created_by_name',
        header: 'Created By',
        enableColumnFilter: false,
        size: 270,
      },

      {
        accessorKey: 'created_at',
        header: 'Created Date',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
          return (
            <span>
              {moment(row.original.datetime).format('DD/MM/YYYY')} (
              {moment(row.original.datetime).format('LT')})
            </span>
          );
        },
      },
      {
        accessorKey: 'updated_by_name',
        header: 'Updated By',
        enableColumnFilter: false,
        size: 200,
        
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated Date',
        enableColumnFilter: false,
        size: 160,
        Cell: ({ renderedCellValue, row }) => {
                 return (
                   <span>
                     {moment(row.original.datetime).format('DD/MM/YYYY')} (
                     {moment(row.original.datetime).format('LT')})
                   </span>
                 );
               },
      },
      
      {
        accessorKey: 'action',
        header: 'Action',
        enableColumnFilter: false,
        size: 100,
        Cell: ({ row }) => (
          <div className="d-flex align-items-center gap-1">
            {/* <Badge bg="primary" className="cursor-pointer">
              <BsPenFill />
            </Badge> */}
            <Badge bg="primary" onClick={() => handleEdit(row)}>
              <MdOutlineEdit />
            </Badge>
            <Badge
              bg="danger"
              className="cursor-pointer"
              onClick={() => dispatch(showModal(row.original))}
            >
              <BsTrash3Fill />
            </Badge>
            <Badge
              bg="warning"
              onClick={() => {
                handlePrint(row.original.checkpoint_id);
              }}
              title="Print SRF"
            >
              <FaPrint />
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const handlePrint = (data) => {
    window.open(`${config.reactUrl}customers/checkpoint-print/${data}`);
    // console.log("data",data);
    // window.open(`http://localhost:5173/customers/checkpoint-print/${data}`);
  };

  const addFormJsx = (
    <Form>
      <Row>
        <Col md={12}>
          <AutoCompletedDropdown
            url={'/api/v0/web/web_customer_dropdown'}
            body={{
              p_search: '',
              p_limit: 10,
            }}
            handleDataChange={(val) => {
              setFormValues((prevValues) => ({
                ...prevValues,
                customer_id: val.customer_id,
                customer_code: val.customer_code,
                company_name: val.company_name,
                // customer_name: val.company_name
              }));
            }}
            valueInput={formValues.company_name}
            objLevel={'company_name'}
            labelName={'Customer'}
          />
        </Col>
        <Col md={6} className="mb-4 d-flex flex-column align-items-center mt-4">
          <TextField
            size="small"
            fullWidth
            label={'QR Code Value'}
            name="qrcode"
            value={formValues.qrcode}
            onChange={handleQrCodeChange}
          />
        </Col>
        <Col md={6} className="mb-4 mt-4">
          <TextField
            size="small"
            fullWidth
            label={'Area'}
            name="area"
            value={formValues.area}
            onChange={handleChange}
          />
        </Col>
        {formValues.qrcode && (
          <Col md={12} className="text-center mb-4">
            <img
              src={config.QrCodeUrl + formValues.qrcode}
              alt="Generated QR Code"
              width="140"
              height="140"
              className="border p-2 rounded-2"
            />
          </Col>
        )}

        <Col md={6} className="mb-4">
          <TextField
            size="small"
            fullWidth
            label={'Interval (in hours)'}
            name="scan_interval"
            value={formValues.scan_interval}
            onChange={handleChange}
            type="number"
          />
        </Col>
        <Col md={6} className="mb-4">
          <TextField
            size="small"
            fullWidth
            label={'Allowed Delay (in minutes)'}
            name="allowed_delay"
            value={formValues.allowed_delay}
            onChange={handleChange}
            type="number"
          />
        </Col>
        <Col md={12} className="d-flex justify-content-end gap-2">
          <Button
            size="sm"
            variant="none"
            className="canclebutton"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="none"
            type="button"
            className="savebutton"
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
  );

  return (
    <MainLayout
      pageName={'Customer CheckPoints'}
      columns={gridColumn}
      hasAddButton={true}
      branchDropdown={false}
    >
      <CommonDataGrid
        url={'/api/v0/web/web_checkpoint_browse'}
        columns={gridColumn}
        body={body}
        jsonUpd={updateGrid}
      />
      <ModalComponent
        innerJsx={addFormJsx}
        modalTitle={formTitle}
        hidden={addButton}
      />
      <DeleteModal removeId={handleDelete} data={deleteModalData} />
      <SuccessMessage hidden={showSuccess} />
    </MainLayout>
  );
}
