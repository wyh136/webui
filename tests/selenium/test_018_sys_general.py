# Author: Rishabh Chauhan
# License: BSD
# Location for tests  of FreeNAS new GUI
# Test case count: 1

import sys
import os
import time
cwd = str(os.getcwd())
sys.path.append(cwd)
from function import take_screenshot


skip_mesages = "Skipping first run"
script_name = os.path.basename(__file__).partition('.')[0]

xpaths = {
    'navSystem': "//span[contains(.,'System')]",
    'submenuGeneral': "//a[contains(text(),'General')]",
    'breadcrumbBar': "//*[@id='breadcrumb-bar']/ul/li[2]/a"
}


def test_01_nav_system_general(wb_driver):
    # Navigating to System>General page
    wb_driver.find_element_by_xpath(xpaths['navSystem']).click()
    # allowing page to load by giving explicit time(in seconds)
    time.sleep(1)
    wb_driver.find_element_by_xpath(xpaths['submenuGeneral']).click()
    # get the ui element
    ui_element = wb_driver.find_element_by_xpath(xpaths['breadcrumbBar'])
    # get the weather data
    page_data = ui_element.text
    # assert response
    assert "General" in page_data, page_data
    # taking screenshot
    test_name = sys._getframe().f_code.co_name
    take_screenshot(wb_driver, script_name, test_name)
