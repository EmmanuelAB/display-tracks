import os
from xml.dom.minidom import parse
import xml.dom.minidom as minidom

#Some named values, for better readability
READ_ONLY = "r"
SOURCE_DIRECTORY = "all_tracks"
OUTPUT_DIRECTORY = "filtered_tracks"
LAST_ELEMENT = -1
DATE_LENGTH = len("yyyy-mm-dd")


'''
Input:  the filename of the gpx file to extract the date from
Output: the date of the track in the gpx file
Constraint: the file must be in the current directory
'''
def extract_date(gpx_filename):
	document = minidom.parse(gpx_filename);
	time_tags = document.getElementsByTagName("time")
	#Get the last time tag in the document
	last_time_tag = time_tags[LAST_ELEMENT]
	#Get the "innerHTML" text of the tag. Example: "2017-09-18T21:03:55Z"
	complete_date = last_time_tag.firstChild.data
	#Only return the date of the string (remove the "T" and everything after it)
	return complete_date[0:DATE_LENGTH]




'''
Input:  a list of filenames
Output: a list containing only the gpx-terminated filenames
'''
def remove_non_gpx_filenames(filenames_list):
	return filter(lambda string : string.endswith(".gpx"), filenames_list)



'''
	MAIN PROGRAM
'''
def main():
	#Get the list of only gpx filenames in the current directory
	filenames_list = remove_non_gpx_filenames(os.listdir(SOURCE_DIRECTORY))
		
	for filename in filenames_list:

		filename = SOURCE_DIRECTORY + "/" + filename
		# print(filename);

		#Get the date of the track
		date = extract_date(filename)
		date_folder = OUTPUT_DIRECTORY + "/" + date

		# print(date_folder);
		# date_folder = SOURCE_DIRECORY + "/" + date
		#Check if the folder to put the current file at, already exists
		if (not os.path.isdir(date_folder)):
			# If it doesn't exist then create it
			os.mkdir(date_folder)
		#Move the file to the folder named as the file's date
		os.system('mv '+filename+" "+date_folder+"/")

main()
