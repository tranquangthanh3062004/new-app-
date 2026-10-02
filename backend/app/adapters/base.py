from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseTrendAdapter(ABC):
    @abstractmethod
    def fetch_trends(self, region: str = "VN", category: str = None) -> List[Dict[str, Any]]:
        """Fetch raw trends from external data source"""
        pass
