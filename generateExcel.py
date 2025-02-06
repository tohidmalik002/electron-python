import os
import sqlite3
import pandas as pd

def get_sql_data(database_path, query):
    connection = sqlite3.connect(database_path)
    
    cursor = connection.cursor()
    cursor.execute(query)
    data = cursor.fetchall()  
    
    connection.close()
    
    return data

def generate_excel_from_data(data=None, column_names=None, output_filename=None):
    data = [(1, 'Alice', 25), (2, 'Bob', 30), (3, 'Charlie', 35)] 
    column_names = ['ID', 'Name', 'Age'] 
    output_filename = 'output.xlsx'


    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    file_path = os.path.join(desktop_path, output_filename)
    
    df = pd.DataFrame(data, columns=column_names)
    
    df.to_excel(file_path, index=False)
    print(f"Excel file saved to: {file_path}")

if __name__ == "__main__":
    # database_path = 'your_database.db'
    # query = 'SELECT * FROM your_table_name' 
    # column_names = ['Column1', 'Column2', 'Column3'] 

    # Get SQL data
    # data = get_sql_data(database_path, query)

    # Generate Excel file and save it to Desktop
    generate_excel_from_data()

