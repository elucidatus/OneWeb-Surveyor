# Run this script to generate the correct xml file.

## Constants
num_of_bars = 360
id_prefix = "l"
id_suffix = ""
output_name = 'chart.xml'
color = "green"

## You probably won't need to touch the rest

# Make the columns; * makes the column occupy all available horizontal space
col_settings = ""
for i in range(num_of_bars-1):
    col_settings+="*, "
col_settings+="*"

str_beg = "\t<Label verticalAlignment=\"bottom\" backgroundColor=\"" + color + "\" id=\"" + id_prefix
str_mid = id_suffix + "\" row=\"0\" col=\""
str_end = "\"/>\n"

f  = open(output_name, 'w')
f.write("<GridLayout rows=\"auto\" columns=\"" + col_settings + "\">\n")
for i in range(num_of_bars):
    f.write(str_beg + `i` + str_mid + `i` + str_end)
f.write("</GridLayout>")
f.close()