import { Button, Col, Container, Form, Row } from "react-bootstrap"
import MainLayout from "../../../components/MainLayout"
import { Link } from "react-router-dom"
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { TextField } from "@mui/material"

function AddHR() {
    return (
        <MainLayout pageName="Add HR" hasAddButton={false}>
       <Container className="formwrapper mt-0" fluid>
                <div className="d-flex justify-content-end w-100 mb-3">
                    <Link className="backlink" to="/users/hr">
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
                                        name="emp_code"
                                    // onChange={}
                                    />
                                </Col>
                                <Col md={4}>
                                    <TextField
                                        size="small"
                                        label="Full Name"
                                        variant="outlined"
                                        fullWidth
                                        name="full_name"
                                    // onChange={}
                                    />
                                </Col>
                                <Col md={4}>
                                    <TextField
                                        size="small"
                                        label="Mobile"
                                        variant="outlined"
                                        fullWidth
                                        name="mobile"
                                    // onChange={}
                                    />
                                </Col>
                                <Col md={4}>
                                    <TextField
                                        size="small"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        name="email"
                                    // onChange={}
                                    />
                                </Col>
                                <Col md={4}>
                                    <TextField
                                        size="small"
                                        label="Address"
                                        variant="outlined"
                                        fullWidth
                                        name="address"
                                    // onChange={}
                                    />
                                </Col>
                         
                                <Col md={4}>
                                    <Form.Control size="md" type="file" />
                                </Col>
                                <Col md={12}>
                                    <Button
                                        size="sm"
                                        variant="none"
                                        type="button"
                                        className="commonBtn mt-4"
                                    // onClick={() => navigate('/masters/users')}
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
    )
}

export default AddHR