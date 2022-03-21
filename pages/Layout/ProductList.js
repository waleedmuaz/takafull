import React, { useCallback, useEffect, useState} from 'react';
import {Button, Layout, Card, DataTable, Page, Tabs} from '@shopify/polaris';
import TabsContent from "../Layout/TabContent"
import SelectProduct from '../SelectProduct';


export default function ProductList() {


    const [active, setActive] = useState(false);

    const [renderDataArray, setrenderDataArray] = useState([["-","-",'-','-','-','-','-','-']]);
    async function getBundlePlan(){
        let returedObj=[];
        let data = await fetch('/api/get/product/takaful', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }) ;
          let i=0;
          let jsonObj = await data.json();
          jsonObj.data.forEach(element => {
            returedObj[i]=[
              element.id,
              element.product_id,
              JSON.parse(element.product_json).title,
              JSON.parse(element.product_json).status,
              JSON.parse(element.product_json).createdAt,
              "YES",
              JSON.parse(element.product_json).tags,
            ]
            i++;
          });
          return setrenderDataArray(returedObj);
      } 
    useEffect(() => {
        getBundlePlan(); 
    }); 
      const rows = renderDataArray ;



    return (
        <Page title='Product List'> 
        <Card>
        <SelectProduct active={active} setActive={setActive}/>
            <Layout>
                <Layout.Section>
                    <TabsContent/>
                </Layout.Section>
                <Layout.Section>
                <DataTable
                columnContentTypes={[
                'numeric',
                'numeric',
                'text',
                'text',
                'text',
                'text',
                'text',
                // 'button',
                ]}
                headings={[
                '#',
                'Product Id',  
                'Product Name',
                'Status',
                'Created At',
                'Takaful',
                'Tags',
                // 'View',
                ]}
                rows={rows}
            />
                </Layout.Section>
            </Layout>
            </Card>
        </Page>
      );
}