import React, { useEffect, useState} from 'react';
import {  Page,EmptyState  } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';

export default function SelectProduct(props) {
  const [open, setOpen] = useState(false);
  const [Products, setProducts] = useState(undefined);

  async function initialSelectedProduct(){
     let returedObj=[];
     let i=0;
     let data = await fetch('/api/get/product/takaful', {
       method: 'GET',
       headers: {
         'Content-Type': 'application/json',
       },
     }) ;
     let dataJson= await data.json();
     dataJson.data.forEach(element => {
         returedObj[i]={
           "id":"gid://shopify/Product/"+element.product_id,
         }
         i++;
       });
       return setProducts(returedObj); 
     }

  function handleSelection(resources){
    fetch('/api/store/product/takaful', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(resources),
    }) ;
    props.setActive(true)
    setOpen(false);
  }; 


  useEffect(() => {
    initialSelectedProduct();
  });

  
   return (
      <Page>
        {/* <TitleBar
          primaryAction={{
            content: 'Select products',
            onAction: () => setOpen(true),
          }}
        /> */}
        <div style={{"display":"inline-block !important"}}>
          <EmptyState
          action={{
            content: '+ Add products',
            onAction: () => setOpen(true),
          }}
          >
          </EmptyState>
        </div>
        <ResourcePicker   
          resourceType="Product" 
          initialSelectionIds={Products}
        //   selectMultiple={false}
        //   showHidden={false}
        //   showVariants={false}
          
          open={open}
          onSelection={(resources) => handleSelection(resources)}
          onCancel={() => setOpen(false)}
        />
      </Page>
    );
  }