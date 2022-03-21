import React, { useState} from 'react';
import { Card, Page} from '@shopify/polaris';
import PolicyList from './PolicyList';



export default function ProductWithTakafulList() {
 
   return (
      <Page title="Takaful Plans">
        <Card>
          <PolicyList/>
        </Card>
      </Page>
  );
    
}