// const __DEV__ = window.location.hostname === "localhost";
const __DEV__ = window.location.hostname === 'localhost';
// import XLSX from "sheetjs-style";
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { excelImage } from '../utils/images';

export const authUser = (data) => {
  localStorage.setItem('auth', JSON.stringify(data));
};
// eslint-disable-next-line react-refresh/only-export-components
export const getAuthUser = () => {
  return localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth'))
    : null;
};
export const authShareUser = (data) => {
  sessionStorage.setItem('auth', JSON.stringify(data));
};
export const getAuthShareUser = () => {
  return sessionStorage.getItem('auth')
    ? JSON.parse(sessionStorage.getItem('auth'))
    : null;
};

export const TableExportButton = ({ excelData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const excelExportButton = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const excelBuffer = XLSX.write(
      {
        Sheets: { data: ws },
        SheetNames: ['data'],
      },
      { bookType: 'xlsx', type: 'array' }
    );
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, fileName + fileExtension);
  };

  const handleExport = () => {
    excelExportButton();
  };

  return (
    <div className="exportbutton">
      <Button
        size="sm"
        variant="success"
        className="d-flex align-items-center gap-2"
        onClick={handleExport}
      >
        <img src={excelImage} alt="excel" className="excelicon" />
        Export
      </Button>
    </div>
  );
};
