from typing import TypedDict, List
from bs4 import BeautifulSoup as bs
from bs4.element import ResultSet
import requests

from api.models import SecFilingPaths


class Position(TypedDict):
    title: str
    cusip: str
    value: int
    shares: int
    shares_type: str

class ThirteenFFetcher:
    def _fetch_primary(self):
        path = self.filing_path_obj.path
        url = f'https://sec.report/Document/{path}/primary_doc.xml'
        print(f"Requesting 13F: {url}")
        r = self.client.get(url, headers=self.headers)
        self.primary = r.text
        return

    def _fetch_positions(self):
        path = self.filing_path_obj.path
        url = f'https://sec.report/Document/{path}/form13fInfoTable.xml'
        print(f"Requesting 13F: {url}")
        r = self.client.get(url, headers=self.headers)
        self.data = r.text
        return

    def __init__(self, filing_path_obj: SecFilingPaths):
        self.filing_path_obj = filing_path_obj
        self.client = requests.Session()
        self.headers = {"User-Agent": "Calum Russell calum.mj.russell@gmail.com"}
        self._fetch_positions()
        self._fetch_primary()


class ThirteenFParser:
    def _parse(self):
        self.positions: List[Position] = []
        for info_table in self.info_tables:
            position = Position(
                title=info_table.find("titleofclass").string,
                cusip=info_table.find("cusip").string,
                value=int(info_table.find("value").string),
                shares=int(info_table.find("sshprnamt").string),
                shares_type=info_table.find("sshprnamttype").string,
            )
            self.positions.append(position)
        return

    def __init__(self, xml):
        self.xml = bs(xml, "lxml")
        self.info_tables: ResultSet = self.xml.find_all("infotable")
        self._parse()

    def get_positions(self) -> List[Position]:
        return self.positions
