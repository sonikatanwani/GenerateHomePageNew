This grunt task(createTemplate) creates template for homepage.

It has following features:-

1. It generates HTML file for homepage and applies proper styles and foundation classes.

2. It applies Macy’s style to the HP template so that we can test it as per 
   test	environment.

3. It has the module for image dimension. Using this module, it will set the image width 
   and height.

4. It supports auto-populating area tag with image href and alt text. To support 
   this feature, developer needs to provide linking_doc.xslx. This excel sheet 
   should confirm to specific format. 

5. It supports floaters for homepage. 

    This task requires following parameters:-

   —columnDetails: This is mandatory parameter. It should contain number of rows and number of images(columns) in each row. 

   —floater: This is optional parameter. If floater functionality is required, this parameter should be specified. 
             If this parameter is set, it require that there should be image with name ‘floater.png’. 
             This image will be use to generate floater html.



Below is the sample example. I have generated homepage for 111515 using this task.

grunt createTemplate:111515 --columnDetails=1,2,2,2,2,2,2,1,1,3,1,1,1,3,1,1 --floater

After running above command, I can see new homepage.html created inside my folder 111515.

Below is the explanation for parameters passed in this example:-

111515 		-> This is folder where I want this task to generate the HTML and also this is folder where it will find all the images.

--columnDetails —> This parameter tell number of rows and columns required for this homepage.

—-floater	-> This parameter specifies that this home page requires floater functionality.

Since I have created linking_doc.xslx in my folder 111515, this task also generated area tag with respective href links and alt text.

Let me know if you face any issues. I will be happy to make it work for you.




