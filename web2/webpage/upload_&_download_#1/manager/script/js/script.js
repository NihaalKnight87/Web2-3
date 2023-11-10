document.getElementById('btn1_1').addEventListener('click', btn_1);
document.getElementById('btn2_1').addEventListener('click', btn_2);
document.getElementById('btn3_1').addEventListener('click', btn_3);
document.getElementById('File_1').addEventListener('change', btn_Choose_Doc);
document.getElementById('Submit_btn1_1').addEventListener('click', btn_Upload);

var is_file_SEL = false;
var is_Folders_SEL = false;

//START UPLOAD
function btn_1(){
    const btn_1 = document.getElementById('btn1_1');
    const btn_2 = document.getElementById('btn2_1');
    const btn_3 = document.getElementById('btn3_1');

    btn_1.classList.remove('Enable_Btn')
    btn_2.classList.add('Enable_Btn');
    btn_3.classList.add('Enable_Btn');
}
//SELECT FOLDER
function btn_2(){
    is_file_SEL = false;
    is_Folders_SEL = true;
	
	const CF_Cover = document.getElementById('CF_Cover');
    const CF_label_1 = document.getElementById('CF_label1_1');
    const btn_2 = document.getElementById('btn2_1');
    const btn_3 = document.getElementById('btn3_1');
    const Btn_File_1 = document.getElementById('Btn_File_1');
    const File_1 = document.getElementById('File_1');

    CF_label_1.textContent = "Choose (Folder)";
	CF_Cover.classList.add('CF_Cover_Enable');
    btn_2.classList.remove('Enable_Btn');
    btn_3.classList.remove('Enable_Btn');
    Btn_File_1.classList.add('Enable_Btn');
    File_1.setAttribute('webkitdirectory', '');
    File_1.setAttribute('webkitdirectory', '');
    File_1.setAttribute('mozdirectory', '');
    File_1.setAttribute('msdirectory', '');
    File_1.setAttribute('odirectory', '');
    File_1.setAttribute('directory', '');
    File_1.setAttribute('multiple', '')
}
//SELECT FILE
function btn_3(){
    is_file_SEL = true;
    is_Folders_SEL = false;

    const CF_Cover = document.getElementById('CF_Cover');
    const CF_label_1 = document.getElementById('CF_label1_1');
    const btn_2 = document.getElementById('btn2_1');
    const btn_3 = document.getElementById('btn3_1');
    const Btn_File_1 = document.getElementById('Btn_File_1');

    CF_label_1.textContent = "Choose (File)";
	CF_Cover.classList.add('CF_Cover_Enable');
    btn_2.classList.remove('Enable_Btn');
    btn_3.classList.remove('Enable_Btn');
    Btn_File_1.classList.add('Enable_Btn');
}

//CHOOSE FILE / FOLDER
function btn_Choose_Doc(){
    const File_1 = document.getElementById('File_1');
    const Submit_btn1_1 = document.getElementById('Submit_btn1_1');
    const Status_FileText = document.getElementById('Status_FileText_1');

    if(File_1.files.length > 0){
        Submit_btn1_1.classList.add('Enable_Btn');
        
        if(is_file_SEL){
            Status_FileText.textContent = "Selected File: ../" + File_1.files[0].name;
        }
        else if(is_Folders_SEL){
            var RelativePath_Folder = File_1.files[0].webkitRelativePath.split("/");
            Status_FileText.textContent = "Selected File: ../" + RelativePath_Folder[0] + "/";
        }
        Status_FileText.classList.add('Enable_Status_FileText');
    }else{
        Submit_btn1_1.classList.remove('Enable_Btn');
        Status_FileText.textContent = "No File Chosen";
        Status_FileText.classList.remove('Enable_Status_FileText');
    }
}

//UPLOAD
function btn_Upload()
{
    const File_1 = document.getElementById('File_1');

    if(is_file_SEL){
        const DATA_Upload = File_1.files[0];

        if(DATA_Upload){
            const reader = new FileReader();
            reader.onload = function(event){
                const fileContent = event.target.result;
                const newBlob = new Blob([fileContent], {type: DATA_Upload.type});

                const a = document.createElement('a');
                const url = window.URL.createObjectURL(newBlob);
                a.href = url;
                a.download = DATA_Upload.name;
                a.style.display = 'none';

                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                location.reload();
            };
            reader.readAsArrayBuffer(DATA_Upload);
        }else{ alert('Pls, Choose a valid file!'); location.reload();}

    }else if(is_Folders_SEL){
        const DATA_Upload = File_1.files;

        if(DATA_Upload.length > 0){
            const zip = new JSZip();

            async function addFilesToZip(files, parentPath = ''){
                for (const file of files){
                    const path = parentPath + file.webkitRelativePath;

                    if (file.size > 0){
                        // Only add non-empty files to the zip
                        await new Promise((resolve) => {
                            file.arrayBuffer().then((content) => {
                                zip.file(path, content);
                                resolve();
                            });
                        });
                    }
                    // else{
                    //     zip.file(path, '');
                    // }
                }
            }
            
            addFilesToZip(DATA_Upload).then(() => {
                zip.generateAsync({type: 'blob'}).then(function(content){
                    const a = document.createElement('a');
                    const url = window.URL.createObjectURL(content);
                    a.href = url;
                    var RelativePath_Folder = DATA_Upload[0].webkitRelativePath.split("/");
                    a.download = RelativePath_Folder[0] + '.zip';
                    a.style.display = 'none';
    
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    location.reload();
                });
            });
        }else{ alert('Pls, Choose a valid folder!'); location.reload();}
    }
}