import {useCallback, useEffect, useState,useContext } from "react";
import {Card, Layout, Tabs} from '@shopify/polaris';
import {useRouter} from "next/router";
import {Loading} from "@shopify/app-bridge/actions";
import findIndex from 'lodash/findIndex';
import { Context } from '@shopify/app-bridge-react';


export default function TabContent() {
  
  const tabsList = [
    {
      id: 'takaful-plans',
      content: 'Takaful Plans',
      accessibilityLabel: 'TakaFul Plan',
      panelID: 'takaful-plans',
      route:'/'
    },
    {
      id: 'order-list',
      content: 'Order List',
      panelID: 'order-list',
      route:'/Layout/OrderList'
    },
    {
      id: 'product-list',
      content: 'Product List',
      panelID: 'product-list',
      route:'/Layout/ProductList'

    },
  ];
    const router = useRouter();
    const app = useContext(Context);


    const loading = Loading.create(app);
    let [selectedIndex, setSelected] = useState(0);

    useEffect(() => {

        if(findIndex(tabsList, {'route': router.pathname})){
            setSelected(findIndex(tabsList, {'route': router.pathname}));
        }

    }, [router]);
    const handleTabChange = useCallback(
        async (selectedTabIndex) => {
            setSelected(selectedTabIndex);
            loading.dispatch(Loading.Action.START);
            await router.push(`${tabsList[selectedTabIndex].route}`, `${tabsList[selectedTabIndex].route}`);
            loading.dispatch(Loading.Action.STOP);
        }, 
        [],
    );

  return (
      <Tabs 
        tabs={tabsList}
        selected={selectedIndex}
        onSelect={handleTabChange}
      >
      </Tabs>
  );
}
