import { Autocomplete, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { CommonController } from "./CommonController";


// export const AutoCompletedDropdown = memo(
//   ({
//     url,
//     handleDataChange,
//     labelName,
//     valueInput,
//     objLevel,
//     disabled,
//     body = {},
//     id,
//   }) => {
//     const [listData, setlistData] = useState([]);
//     const dropDownList = async (search, body) => {
//       await CommonController.commonApiCallFilter(
//         url,
//         { p_search: search, ...body },
//         'post',
//         'node'
//       ).then((data) => {
//         console.log(data)
//         if (data.valid) {
//           setlistData(data.data);
//         }
//       });
//     };
//     useEffect(() => {
//       if (Object.keys(body)?.length > 0) {
//         dropDownList('', body);
//       }
//     }, [body]);
//     useEffect(() => {
//       dropDownList('', body);
//     }, []);


//     console.log(objLevel)
//     console.log(listData)
//     return (
//       <Autocomplete
//         size="small"
//         id={id}
//         options={listData}
//         disabled={disabled}
//         getOptionLabel={(option) => option[objLevel]}
//         onPaste={() => false}
//         fullWidth
//         value={valueInput ? { [objLevel]: valueInput } : null}
//         onChange={(_e, value) => {
//           if (value) {
//             handleDataChange(value);
//           } else {
//             handleDataChange({ [objLevel]: '' });
//           }
//         }}
//         variant="outlined"
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             onChange={(e) => {
//               handleDataChange({ [objLevel]: e.target.value });
//               dropDownList(e.target.value, body);
//             }}
//             label={labelName}
//             variant="outlined"
//           />
//         )}
//       />
//     );
//   }
// );


export const AutoCompletedDropdown = memo(
  ({
    url,
    handleDataChange,
    labelName,
    valueInput,
    objLevel,
    disabled,
    body = {},
    id,
  }) => {
    const [listData, setListData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [debounceTimer, setDebounceTimer] = useState(null); 

    const dropDownList = async (search, body) => {
      try {
        const response = await CommonController.commonApiCallFilter(
          url,
          { p_search: search, ...body },
          "post",
          "node"
        );
        if (response.valid) {
          setListData(response.data);
        } else {
          setListData([]);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setListData([]);
      }
    };
    useEffect(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        dropDownList(searchText, body);
      }, 300); // Debounce delay

      setDebounceTimer(timer);

      return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
      if (Object.keys(body)?.length > 0) {
        dropDownList("", body); 
      }
    }, [body]);

    return (
      <Autocomplete
        size="small"
        id={id}
        options={listData}
        disabled={disabled}
        getOptionLabel={(option) => option[objLevel] || ""}
        fullWidth
        value={valueInput ? { [objLevel]: valueInput } : null}
        onChange={(_, value) => {
          if (value) {
            handleDataChange(value);
          } else {
            handleDataChange({ [objLevel]: "" });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setSearchText(e.target.value)} // Update searchText
            label={labelName}
            variant="outlined"
          />
        )}
      />
    );
  }
);





export const AutoCompleteDropdownWithoutUrl = memo(
  ({
    labelName,
    valueInput,
    listData,
    id,
    objLevel,
    disabled,
    handleDataChange,
  }) => {
    return (
      <Autocomplete
        size="small"
        id={id}
        options={listData}
        disabled={disabled}
        getOptionLabel={(option) => option[objLevel]}
        onPaste={() => false}
        fullWidth
        value={{
          [objLevel]: valueInput
        }}
        onChange={(e, value) => {
          if (value) {
            handleDataChange(value);
          }
        }}
        variant="outlined"
        renderInput={(params) => (
          <TextField {...params} label={labelName} variant="outlined" />
        )}
      />
    );
  }
);

export const AutoCompleteDropdownId = memo(
  ({ url, body, handleDataChange, labelName, valueInput, objLevel }) => {

    const dropDownList = async () => {
      await CommonController.commonApiCallFilter(
        url,
        body,
        'post',
        'node'
      ).then((data) => {
        if (data.valid) {
          setlistData(data.data);
          if (valueInput !== '') {
            const filterData = data.data.filter(
              (val) => val[objLevel] === valueInput
            );
            setfieldValue(filterData[0]);
          } else {
            const objkey = Object.keys(data.data[0]);
            let obj = {};
            objkey.forEach((val) => {
              obj[val] = '';
            });
            setfieldValue(obj);
          }
        } else {
          setfieldValue({ [objLevel]: '' });
        }
      });
    };
    const handleAutoChange = (value) => {
      handleDataChange(value);
      setfieldValue(value);
    };
    useEffect(() => {
      dropDownList();
    }, [body]);
    return (
      <Autocomplete
        size="small"
        options={listData}
        getOptionLabel={(option) => option[objLevel]}
        fullWidth
        value={fieldValue}
        onChange={(e, value) => handleAutoChange(value)}
        variant="outlined"
        renderInput={(params) => (
          <TextField {...params} label={labelName} variant="outlined" />
        )}
      />
    );
  }
);