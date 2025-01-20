/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Modal, Button, Row, Col, Form, Carousel } from 'react-bootstrap';
import { userService } from '../../../service/service';
import SuccessMessage from '../../components/SuccessMessage';
import moment from 'moment';
import audio from '../../assets/sounds/emergency.mp3';
import { FaCheck } from 'react-icons/fa';
import config from '../../../service/config';
// import config from '../../../service/config';

function Sos({ triggerSOS, reload }) {
  const type = localStorage.getItem('login-type');
  const [showModal, setShowModal] = useState(false);
  const [sosData, setSosData] = useState(null);
  const [isMarked, setIsMarked] = useState(false);
  const audioRef = useRef(null);

  // const initialSos = {
  //   alert_id: sosData?.alert_id,
  //   updated_by_type: type,
  //   comment: '',
  // }
  const [markSos, setMarkSos] = useState('')


  function handleOnChange(event, index) {
    const value = event.target.value;
    setMarkSos(value)
  }

  const fetchSosData = async () => {
    try {
      const response = await userService.post('/api/v0/web/browse_sos_alerts', {
        guard_id: null,
        p_search: '',
      });

      if (response.data.valid) {
        audioRef.current.play();
        setSosData(response.data.data);
        setShowModal(true);
      } else {
        setShowModal(false)
      }
    } catch (err) {
      console.error('Error fetching SOS data:', err);
    }
  };

  useEffect(() => {
    if (triggerSOS) {
      //   setShowModal(true);
      fetchSosData();
    }
  }, [triggerSOS]);

  // const handleMarkAsRead = () => {

  //   setShowModal(false);
  //   alert('Marked as read');
  // };

  const handleMarkAsRead = async (data) => {
    try {
      const response = await userService.post(
        '/api/v0/web/web_guard_sos_alert_mark_read',
        { alert_id: data.alert_id, comments: markSos, updated_by_type: "Admin"  }
      );
      console.log('MARKED =>', response);
      setMarkSos('');
      fetchSosData();
      setIsMarked(true);
      setTimeout(() => {
        setIsMarked(false)
      }, 2000);

    } catch (err) {
      console.err(err);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audio} />
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header className="bg-white" closeButton>
          <Modal.Title className="text-dark fs-3">SOS Alert ⚠</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white text-white p-4">
          <div className='soscontent'>

            {sosData ? sosData.map((item, index) => {
              return <Row key={item.alert_id}>
                {/* <img
                          src={`${config.nodeUrl}/${item.guard_pic}`}
                          // src={`${config.nodeUrl}/${sosData.guard_pic}`}
                          alt="Alert"
                          width={100}
                          height={100}
                        /> */}
                <Col md={12} className='mb-3'>
                  <div className='bg-danger rounded-4 p-3'>

                    <Row>
                      <Col xs={4}>
                        {/* <img
                          src={`${config.nodeUrl}/${item.guard_pic}`}
                          
                          
                          // src={`${config.nodeUrl}/${sosData.guard_pic}`}
                          alt="Alert"
                          width={100}
                          height={100}
                        /> */}
                  <img src={`${config.nodeUrl}/${item?.guard_pic}`}
                    alt="Alert"
                    width={100}
                    height={100}
                     />
                      </Col>
                      <Col xs={6}>
                        <h5 className="text-white">
                          <span className="fs-6">Employee Code:</span>
                          <br /> {item.emp_code}
                        </h5>
                        <h5 className="text-white">
                          <span className="fs-6">Name:</span>
                          <br /> {item.guard_name}
                        </h5>
                        <h5 className="text-white">
                          <span className="fs-6">Phone:</span>
                          <br /> {item.guard_mobile}
                        </h5>
                        <h5 className="text-white">
                          <span className="fs-6">Email:</span>
                          <br /> {item.guard_email}
                        </h5>
                      </Col>
                      <Col xs={2} className="fw-bold text-end d-flex flex-column justify-content-between p-1">
                        <span>
                          {index + 1}
                        </span>
                        <span className='text-center lh-1 bg-light text-dark rounded-2'>
                          <h5 className='m-0 mt-2'>Time:</h5>
                          <h6>{moment(item.alert_time).format('LT')}</h6>
                          <h6>{moment(item.alert_time).format('DD-MM-YYYY')}</h6>
                        </span>
                      </Col>
                      <hr className="mt-3" />
                      <Col md={12}>
                        <Row>
                          <Col xs={6}>
                            <h5>
                              <u>Customer</u>
                            </h5>
                            <h5 className="text-white">
                              <span className="fs-6">Customer Code:</span>
                              <br /> {item.customer_code}
                            </h5>
                            <h5 className="text-white">
                              <span className="fs-6">Company Name:</span>
                              <br /> {item.company_name}
                            </h5>
                         
                          </Col>
                          <Col xs={6}>
                            <span className="fs-6">Add Remarks</span>
                            <Form.Control as='textarea' value={markSos} onChange={e => handleOnChange(e, index)} name="comments" style={{ height: '100px' }} className='mb-3' />
                            <Button variant="dark" onClick={() => handleMarkAsRead(item)}>
                              <FaCheck /> Mark Read
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>



                  </div>

                </Col>
              </Row>
            }) : <p>Loading SOS data...</p>}


          </div>

        </Modal.Body>
      </Modal>

      <SuccessMessage hidden={isMarked} />
    </>
  );
}

export default Sos;
