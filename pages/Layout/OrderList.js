import React, { useCallback, useEffect, useState} from 'react';
import {Button, Layout, Card, DataTable, Page, Tabs} from '@shopify/polaris';
import TabsContent from "../Layout/TabContent"


export default function OrderList() {

    const [renderDataArray, setrenderDataArray] = useState([["-","-",'-','-','-','-','-','-']]);
    async function getBundlePlan(){
        let returedObj=[];
        let data = await fetch('/api/get/orders/list', {
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
              element.order_id,
              JSON.parse(element.json_order).customer.email,
              JSON.parse(element.json_order).created_at,
              JSON.parse(element.json_order).total_price,
              element.policy_id,
              JSON.parse(element.json_order).takaful_plan_id,
              JSON.parse(element.json_order).takaful_plan_duration,
              JSON.parse(element.json_order).takaful_plan_amount,
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
        <Page title='Order List'> 
        <Card>
            <Layout>
                <Layout.Section>
                    <TabsContent/>
                </Layout.Section>
                <Layout.Section>
                <DataTable
                columnContentTypes={[
                'numeric',
                'text',
                'text',
                'text',
                'text',
                'text',
                'numeric',
                'numeric',
                'text',
                // 'button',
                ]}
                headings={[
                '#',
                'Order Id',  
                'Customer Email',
                'Order At',
                'Total Price',
                'Takaful Plan Id',
                'Policy Id',
                'Duration',
                'Amount',
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