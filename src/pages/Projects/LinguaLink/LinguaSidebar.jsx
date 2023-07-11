import './LinguaSideBar.css'

import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
} from 'cdbreact';
import LinguaHistoryContent from './LinguaHistoryContent';

const LinguaSideBar = ( {history=[], setCurrentWord, numHistoryClicks, setNumHistoryClicks, currentWordIndex,
                   setCurrentWordIndex} ) => {

    return (
        <div className="ll-sidebar">
        <CDBSidebar>
            <CDBSidebarHeader className="ll-sidebar-header" prefix={<i className="fa fa-bars fa-large"></i>}>
                <div href="/" className="text-decoration-none ll-history-title" style={{ color: 'inherit' }}>
                    HISTORY
                </div>
            </CDBSidebarHeader>

            <CDBSidebarContent className="ll-sidebar-content">
                <LinguaHistoryContent history={history} setCurrentWord={setCurrentWord} numHistoryClicks={numHistoryClicks}
                                      setNumHistoryClicks={setNumHistoryClicks} currentWordIndex={currentWordIndex} 
                                      setCurrentWordIndex={setCurrentWordIndex} />
            </CDBSidebarContent>
            
        </CDBSidebar>
        </div>
    );
};

export default LinguaSideBar;