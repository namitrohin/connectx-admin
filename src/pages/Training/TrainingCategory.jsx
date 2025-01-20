import { useMemo, useState } from 'react';
import moment from 'moment';
import { Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    hideModal,
    showModal,
    toggleForm,
    toggleSpinnerAndDisableButton,
} from '../../Redux/Modals';
import { BsEyeFill, BsPenFill, BsTrash3Fill } from 'react-icons/bs';
import DeleteModal from '../../components/DeleteModal';
import CommonDataGrid from '../../components/CommonDataGrid';
import MainLayout from '../../components/MainLayout';
import { userService } from '../../../service/service';
import ModalComponent from '../../components/ModalComponent';
import SuccessMessage from '../../components/SuccessMessage';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';

export default function TrainingCategory() {
    const dispatch = useDispatch();
    const addButton = useSelector((state) => state.addFormButton.show);
    const spinnerButton = useSelector(
        (state) => state.toggleSpinnerAndDisableButton.show
    );
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = useState(false);
    const [formTitle, setFormTitle] = useState('Add Training Category');

    const deleteMessage = useSelector((state) => state.removeModal.message);
    const deleteModalData = {
        name: deleteMessage?.category_name,
        id: deleteMessage?.category_id,
    };

    const initialValues = {
        p_action: 'INSERT',
        category_id: 1,
        category_name: "",
        description: "",
        is_active: "false",
        created_by: 1,
        updated_by: null,
    };

    const [inputValues, setinputValues] = useState(initialValues);

    const [disableValue, setdisableValue] = useState({
        p_designation_id: '',
        disable: false,
    });
    const [body, setbody] = useState({
        refresh: '',
    });
    const [updateGrid, setupdateGrid] = useState(0);

    const handleClose = () => {
        setFormTitle('Add Training Category');
        setinputValues(initialValues);
        dispatch(toggleForm());
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
                accessorKey: 'category_name',
                header: 'Category Name',
                enableColumnFilter: false,
                size: 200,
            },
            {
                accessorKey: 'is_disabled',
                header: 'Disable',
                enableColumnFilter: false,
                size: 100,
                Cell: ({ row, renderedCellValue }) => {
                    // console.log('=>', row.original);
                    return (
                        <div className="actionswitch">
                            <Form.Check
                                type="switch"
                                size="sm"
                                variant="danger"
                                defaultChecked={renderedCellValue}
                                onChange={() => disableCategory(row)}
                            />
                        </div>
                    );
                },
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
                        <Badge
                            bg="primary"
                            onClick={() => {
                                handleEdit(row.original);
                            }}
                            title="Edit SRF"
                        >
                            <MdOutlineEdit />
                        </Badge>
                        <Badge bg="success" onClick={() => handlePreview(row.original)}>
                            <FaEye />
                        </Badge>
                        <Badge bg="danger"
                            className="cursor-pointer"
                            onClick={() => dispatch(showModal(row.oroginal))}>
                            <BsTrash3Fill />
                        </Badge>
                    </div>
                ),
            },
        ],
        []
    );

    const handlePreview = (data) => {
        const obj = { ...data };
        obj.p_action = 'UPDATE';
        navigate('/masters/training-category', {
            state: {
                id: obj.category_id,
                type: 'preview',
            },
        });
    };

    const handleEdit = (data) => {
        const obj = { ...data };
        console.log('data', obj.category_id);
        obj.p_action = 'UPDATE';
        navigate('/masters/training-category', {
            state: {
                id: obj.category_id,
                type: 'edit',
            },
        });
        console.log('Edit', handleEdit);
    };

    const handleChange = (event) => {
        setinputValues({
            ...inputValues,
            [event.target.name]: event.target.value,
        });
    };

    const insertForm = async () => {
        dispatch(toggleSpinnerAndDisableButton(true));
        try {
            const response = await userService.post(
                '/api/v0/web/web_master_training_category_manage',
                inputValues
            );
            if (response.status === 200) {
                if (response.data.status === 400) {
                    alert(response.data.message || 'Found Duplicate Entries');
                    dispatch(toggleSpinnerAndDisableButton(false));
                    return;
                } else {
                    setinputValues({
                        p_action: 'INSERT',
                        category_id: 1,
                        category_name: "",
                        description: "",
                        is_active: "false",
                        created_by: 1,
                        updated_by: null,
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
            setupdateGrid(updateGrid + 1);
            setbody({
                ...body,
                refresh: 2,
            });
            setTimeout(() => {
                setShowSuccess(false);
            }, 1200);
        }
    };


    const disableCategory = async (row) => {
        try {
            const updatedDisableValue = {
                ...disableValue,
                p_is_disabled: !row.original.is_disabled,
                p_category_id: row.original.category_id,
                p_updated_by: row.original.updated_by,
            };

            const response = await userService.post(
                '/api/v0/web/web_master_training_disable',
                updatedDisableValue
            );

            if (response.data.valid) {
                setShowSuccess(true);
                setbody({
                    ...body,
                    refresh: 2,
                });
                setTimeout(() => {
                    setShowSuccess(false);
                }, 1600);
            } else {
                alert('error');
            }
        } catch (err) {
            console.log(err);
        }
    };


    const addFormJsx = (
        <Form>
            <Row>
                <Col md={12} className="mb-4">
                    <TextField
                        size="small"
                        fullWidth
                        label={'Category Name'}
                        name="category_name"
                        value={inputValues.category_name}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={12} className="mb-4">
                    <TextField
                        size="small"
                        fullWidth
                        label={'Description'}
                        name="description"
                        value={inputValues.description}
                        onChange={handleChange}
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

    async function handleDelete(id) {
        const obj = {
            category_id: id,
        };
        try {
            const response = await userService.post(
                '/api/v0/web/web_master_training_category_delete',
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

    return (
        <MainLayout
            pageName={'Training Category'}
            hasAddButton={true}
            branchDropdown={false}
        >
            <CommonDataGrid
                url={'/api/v0/web/browse_training_categories'}
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
