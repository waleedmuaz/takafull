import React, { useCallback, useEffect, useState} from 'react';
import {Button, Card, DataTable, Layout, Page, Tabs} from '@shopify/polaris';
import TabContent from '../pages/Layout/TabContent';


export default function PolicyList() {
    const [renderDataArray, setrenderDataArray] = useState([["-","-",'-','-','-','-','-','-']]);
    async function getBundlePlan(){
        let returedObj=[];
        let data = await fetch('/api/get/plan/takaful', {
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
              element.policy_id,
              element.name,
              element.description,
              element.start_rate,
              element.end_rate,
              element.duration,
              element.amount+"-/PKR",
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
        <Layout>
        <Layout.Section>
            <TabContent/>
        </Layout.Section>
        <Layout.Section>
            <DataTable
                columnContentTypes={[
                'numeric',
                'text',
                'text',
                'numeric',
                'numeric',
                'numeric',
                'text',
                // 'button',
                ]}
                headings={[
                '#',
                'Policy Id',  
                'Bundle Name',
                'Bundle Description',
                'Bundle Start From',
                'Bundle End To',
                'Month',
                'Amount',
                // 'View',
                ]}
                rows={rows}
            />
        </Layout.Section>
      </Layout>
    )
}