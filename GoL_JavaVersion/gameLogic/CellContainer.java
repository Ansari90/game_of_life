package gameLogic;

import java.util.ArrayList;

public class CellContainer {
	private ArrayList<Character> cellContainer;
	private int dimension;
	
	public CellContainer() {
		cellContainer = new ArrayList<Character>();
	}
	
	public void seedContainer(int[] aliveCellLocation) {
		cellContainer.clear();
		dimension = (int) Math.sqrt((double)aliveCellLocation.length);
		
		for(int i = 0; i < aliveCellLocation.length; i++) {
			if(aliveCellLocation[i] == 1){
				cellContainer.add('*');
			}
			else {
				cellContainer.add(' ');
			}
		}
	}
	
	public boolean validCellNum(int number) {
		if(number >= 0 && number < cellContainer.size())
			return true;
		else
			return false;
	}
	
	public int neighborAlive(int cellNumber) {
		if(validCellNum(cellNumber)) {
			if(cellContainer.get(cellNumber) == '*')
				return 1;
			else
				return 0;
		}
		else
			return 0;
	}
	
	public void getNextGeneration() {
		int neighborCounter, cellCounter;
		int[] aliveCellLocation = new int[cellContainer.size()];
		int tempCellCounter;
		
		for(cellCounter = 0; cellCounter < cellContainer.size(); cellCounter++) {
			neighborCounter = 0;			
			
			//middle cells
			tempCellCounter = cellCounter - 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			tempCellCounter = cellCounter + 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			//top cells
			tempCellCounter = cellCounter - dimension;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			tempCellCounter = cellCounter - dimension - 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			tempCellCounter = cellCounter - dimension + 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			//bottom cells
			tempCellCounter = cellCounter + dimension;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			tempCellCounter = cellCounter + dimension - 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			tempCellCounter = cellCounter + dimension + 1;				
			neighborCounter += neighborAlive(tempCellCounter);
			
			switch(neighborCounter) {
			case 0:
			case 1:
			case 4:
			case 5:	
			case 6:
			case 7:
			case 8:
					aliveCellLocation[cellCounter] = 0;
				break;
			case 2:
			case 3:
				if(cellContainer.get(cellCounter) == '*')
					aliveCellLocation[cellCounter] = 1;
				else {
					if(neighborCounter == 3)
						aliveCellLocation[cellCounter] = 1;
				}
				break;
			default:
				aliveCellLocation[cellCounter] = 0;
			}
		}		
		seedContainer(aliveCellLocation);
	}
	
	public void Display() {
		for(int i = 0 ; i < cellContainer.size(); i++) {
			if(i%dimension == 0){
				System.out.print("\n");
			}
			
			System.out.print(cellContainer.get(i));
			
			if(i%dimension < (dimension - 1)) {
				System.out.print(" ");
			}
		}
	}
}
