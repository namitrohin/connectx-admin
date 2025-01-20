/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import OutsideClickHandler from 'react-outside-click-handler';
import { FaCalendarAlt } from 'react-icons/fa';

// ============== Common Date Range Picker =================== ////
export const ConnectXDateRange = ({ onChange, dateLevel, getData }) => {
  const [showPicker, setShowPicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dateFilterRange, setDatefilterRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const dateFilter = async (date) => {
    setDatefilterRange(date?.selection);
    setLoading(true);
  };
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };
  const toggleDatePickerOk = () => {
    if (showPicker) onChange(dateFilterRange);
    setShowPicker(!showPicker);
  };
  useEffect(() => {
    setLoading(true);

    setDatefilterRange({
      ...dateFilterRange,
      startDate: getData.startDate,
      endDate: getData.endDate,
    });
  }, [getData]);

  return (
    <div className="custom-daterange-picker">
      <div
        className="custom-date-input d-flex align-items-center justify-content-end"
        onClick={toggleDatePicker}>
        <div className="dateheader">
          <div className="custom-date-icon ">
            <FaCalendarAlt />
          </div>
          <span style={{ fontSize: '.875rem' }}>
            {loading
              ? moment(dateFilterRange?.startDate).format('DD/MM/YYYY') +
              ' - ' +
              moment(dateFilterRange?.endDate).format('DD/MM/YYYY')
              : dateLevel}
          </span>
        </div>
      </div>
      {showPicker && (
        <OutsideClickHandler onOutsideClick={toggleDatePicker}>
          <div className={`custom-daterange-popup`}>
            <DateRangePicker ranges={[dateFilterRange]} onChange={dateFilter} />
            <div className="text-end picker-toggler">
              <button
                className="btn btn-link "
                type="button"
                onClick={toggleDatePickerOk}
              >
                OK
              </button>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};
