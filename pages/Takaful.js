// import React, {useCallback, useEffect, useState} from 'react';
// import {Button, ChoiceList, Modal, Stack} from '@shopify/polaris';

// export default function Takaful(props) {
  
//   const [selected, setSelected] = useState(['hidden']); 


//   async function getBundlePlan(){
//     let listChoices=[];
//     let data = await fetch('/api/get/plan/takaful', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }) ;
//       let i=0;
//       let jsonObj = await data.json();
//       console.log(jsonObj.data[0].name);
//       jsonObj.data.forEach(element => {
//         listChoices[i]={label: element.name, value: element.id},
//         i++;
//       });
//       console.log(listChoices);
//       return listChoices;
//   } 
 
//   const handleModalChange = useCallback(() => props.setActive(!props.active), [props.active]);

//   const handleClose = () => {
//     console.log(props.SelectedProducts) 
//     handleModalChange();
//   };

//   const handleChange = useCallback((value) =>{
//     setSelected(value)
//   },[]);

//   return (
//     <div>
//       {console.log(getBundlePlan())}
//       <Modal
//         // activator={activator}
//         open={props.active}
//         onClose={handleClose}
//         title="Takaful Bundle"
//         primaryAction={{
//           content: 'Select Takaful',
//           onAction: handleClose,
//         }}
//         secondaryActions={[
//           {
//             content: 'Cancel',
//             onAction: handleClose,
//           },
//         ]}
//       >
//         <Modal.Section>
//           <Stack vertical>
//             <Stack.Item>
//             <ChoiceList
//                 title="Select Takaful"
//                 choices={getBundlePlan}
//                 selected={selected}
//                 onChange={handleChange}
//                 />
//             </Stack.Item>
//           </Stack>
//         </Modal.Section>
//       </Modal>
//     </div>
//   );
// }
