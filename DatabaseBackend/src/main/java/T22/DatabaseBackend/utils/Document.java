package T22.DatabaseBackend.utils;

import T22.DatabaseBackend.models.*;
import T22.DatabaseBackend.models.Question;
import org.apache.poi.sl.draw.geom.GuideIf;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigInteger;
import java.net.http.HttpHeaders;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class Document {
    private Exam exam;
    private List<Question> mcqQuestions;

    private String mcqExamName;

    private String cdmqExamName;
    private List<Question> cdmqQuestions;
    private String[] letters = {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"};


    public Document(){
        mcqQuestions = new LinkedList<>();
        cdmqQuestions = new LinkedList<>();
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public void addMcqQuestion(Question question){
        mcqQuestions.add(question);
    }

    public void addCdmqQuestion(Question question){
        cdmqQuestions.add(question);
    }

    public void createExam(){
        createMCQ();
        createCDMQ();
    }

    public void createMCQ(){
        // create the word document
        XWPFDocument document = createHeading("MCQ's");

        XWPFNumbering numbering = document.createNumbering();
        CTAbstractNum cTAbstractNum = CTAbstractNum.Factory.newInstance();
        cTAbstractNum.setAbstractNumId(BigInteger.valueOf(1));
        CTLvl cTLvl = cTAbstractNum.addNewLvl();
        cTLvl.addNewNumFmt().setVal(STNumberFormat.DECIMAL);
        cTLvl.addNewLvlText().setVal("%1.");
        cTLvl.addNewStart().setVal(BigInteger.valueOf(1));

        XWPFAbstractNum abstractNum = new XWPFAbstractNum(cTAbstractNum);
        BigInteger abstractNumID = numbering.addAbstractNum(abstractNum);

        // loop through all the questions and add them to the document
        int numIndex = 2;
        for (Question question : mcqQuestions){
            createQuestionParagraph(document, question, abstractNumID);
            // print the options, if the option is correct, color is red
            CTAbstractNum cTSubAbstractNum = CTAbstractNum.Factory.newInstance();
            cTSubAbstractNum.setAbstractNumId(BigInteger.valueOf(numIndex));
            CTLvl cTSubLvl = cTSubAbstractNum.addNewLvl();
            cTSubLvl.addNewNumFmt().setVal(STNumberFormat.LOWER_LETTER);
            cTSubLvl.addNewLvlText().setVal("%1)");
            cTSubLvl.addNewStart().setVal(BigInteger.valueOf(1));

            XWPFAbstractNum subAbstractNum = new XWPFAbstractNum(cTSubAbstractNum);
            BigInteger subAbstractNumID = numbering.addAbstractNum(subAbstractNum);
            
            List<Option> optionList = question.getOptionList();
            for(Option option : optionList){
                // option french
                createAnswerParagraph(document, option, subAbstractNumID);
            }
            numIndex++;
        }

        // saving the document
        try {
            String name = this.exam.getName()+" MCQ";
            FileOutputStream out = new FileOutputStream(name+".docx");
            mcqExamName = name + ".docx";
            document.write(out);
            out.close();
            System.out.println("Document created successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void createCDMQ(){
        // create the word document
        XWPFDocument document = createHeading("CDMQ's");

        XWPFNumbering numbering = document.createNumbering();
        CTAbstractNum cTAbstractNum = CTAbstractNum.Factory.newInstance();
        cTAbstractNum.setAbstractNumId(BigInteger.valueOf(1));
        CTLvl cTLvl = cTAbstractNum.addNewLvl();
        cTLvl.addNewNumFmt().setVal(STNumberFormat.DECIMAL);
        cTLvl.addNewLvlText().setVal("%1.");
        cTLvl.addNewStart().setVal(BigInteger.valueOf(1));

        XWPFAbstractNum abstractNum = new XWPFAbstractNum(cTAbstractNum);
        BigInteger abstractNumID = numbering.addAbstractNum(abstractNum);


        // loop through all the questions and add them to the document
        int numIndex = 2;
        for (Question question : cdmqQuestions){
           createQuestionParagraph(document, question, abstractNumID);
            // print the options, if the option is correct, color is red
            CTAbstractNum cTSubAbstractNum = CTAbstractNum.Factory.newInstance();
            cTSubAbstractNum.setAbstractNumId(BigInteger.valueOf(numIndex));
            CTLvl cTSubLvl = cTSubAbstractNum.addNewLvl();
            cTSubLvl.addNewNumFmt().setVal(STNumberFormat.LOWER_LETTER);
            cTSubLvl.addNewLvlText().setVal("%1)");
            cTSubLvl.addNewStart().setVal(BigInteger.valueOf(1));

            XWPFAbstractNum subAbstractNum = new XWPFAbstractNum(cTSubAbstractNum);
            BigInteger subAbstractNumID = numbering.addAbstractNum(subAbstractNum);
            
            List<Option> optionList = question.getOptionList();
            for(Option option : optionList){
                // option french
                createAnswerParagraph(document, option, subAbstractNumID);
            }
            numIndex++;
        }

        // saving the document
        try {
            String name = this.exam.getName()+" CDMQ";
            FileOutputStream out = new FileOutputStream(name+".docx");
            cdmqExamName = name + ".docx";
            document.write(out);
            out.close();
            System.out.println("Document created successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public XWPFParagraph createParagraph(XWPFDocument document){
        XWPFParagraph paragraph = document.createParagraph();
        paragraph.setSpacingAfter(0);

        return paragraph;
    }

    public XWPFDocument createHeading(String examType){
        XWPFDocument document = new XWPFDocument();
        // set the title
        XWPFParagraph heading = createParagraph(document);
        heading.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run1 = heading.createRun();
        run1.setText(exam.getName()+"\n"); // set heading text 
        heading = createParagraph(document);
        heading.setAlignment(ParagraphAlignment.CENTER);
        run1 = heading.createRun();
        run1.setText(examType);
        heading = createParagraph(document);
        heading.setAlignment(ParagraphAlignment.CENTER);

        // set the date
        XWPFRun run2 = heading.createRun();
        SimpleDateFormat dt = new SimpleDateFormat("MMMM dd, yyyy");
        run2.setText("(" + dt.format(exam.getDateCreated()) + " Exam - MD)");
        run2.setBold(true);
        heading = createParagraph(document);
        heading.setAlignment(ParagraphAlignment.CENTER);

        return document;
    }

    public XWPFParagraph createQuestionParagraph(XWPFDocument document, Question question, BigInteger AbstractNumID){
        XWPFParagraph paragraph = createParagraph(document);
        setCustomFirstLineIndent(paragraph, -360);
        setCustomLeftIndent(paragraph, 1080);
        paragraph.setNumID(addNumberingToParagraph(document, AbstractNumID));

        // print the french question
        XWPFRun frenchQuestion = paragraph.createRun();
        frenchQuestion.setText(question.getQuestionFrench());
        frenchQuestion.addBreak();
        frenchQuestion.addBreak();
        frenchQuestion.addBreak();

        // print the english question
        XWPFRun EnglishQuestion = paragraph.createRun();
        EnglishQuestion.setBold(true);
        EnglishQuestion.setText(question.getQuestionEnglish());
        
        paragraph = createParagraph(document);
        setCustomFirstLineIndent(paragraph, -360);
        setCustomLeftIndent(paragraph, 1440);

        return paragraph;
    }

    public XWPFParagraph createAnswerParagraph(XWPFDocument document, Option option, BigInteger subAbstractNumID){
        XWPFParagraph paragraph = createParagraph(document);
        setCustomFirstLineIndent(paragraph, -360);
        setCustomLeftIndent(paragraph, 1440);

        paragraph.setNumID(addNumberingToParagraph(document, subAbstractNumID));
        //paragraph.getCTP().getPPr().getNumPr().addNewIlvl().setVal(BigInteger.valueOf(1));
        XWPFRun frenchOption = paragraph.createRun();
        frenchOption.setText(option.getOptionFrench());
        frenchOption.addBreak();

        // option english
        XWPFRun EnglishOption = paragraph.createRun();
        EnglishOption.setText(option.getOptionEnglish());
        EnglishOption.setBold(true);

        if(option.isCorrect()){
            frenchOption.setColor("FF0000");
            EnglishOption.setColor("FF0000");
        }

        // paragraph.setNumID(numID);

        return paragraph;
    }

    private static BigInteger addNumberingToParagraph(XWPFDocument doc, BigInteger abstractNumID) {
        XWPFNumbering numbering = doc.getNumbering();
        if (numbering == null) {
            numbering = doc.createNumbering();
        }
        BigInteger numID = numbering.addNum(abstractNumID);
        return numID;
    }

    private static void setCustomLeftIndent(XWPFParagraph paragraph, int leftIndent) {
        CTPPr pPr = paragraph.getCTP().getPPr();
        if (pPr == null) {
            pPr = paragraph.getCTP().addNewPPr();
        }

        CTInd ind = pPr.isSetInd() ? pPr.getInd() : pPr.addNewInd();
        ind.setLeft(BigInteger.valueOf(leftIndent));
    }

    private static void setCustomFirstLineIndent(XWPFParagraph paragraph, int firstLineIndent) {
        CTPPr pPr = paragraph.getCTP().getPPr();
        if (pPr == null) {
            pPr = paragraph.getCTP().addNewPPr();
        }

        CTInd ind = pPr.isSetInd() ? pPr.getInd() : pPr.addNewInd();
        ind.setFirstLine(BigInteger.valueOf(firstLineIndent));
    }

    public byte[] getByteArray(){
        // create a byte array output stream to write the zip file to
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(baos);

        try {
            // Add the first file to the ZipOutputStream using ZipEntry
            File firstFile = new File(mcqExamName);
            ZipEntry firstEntry = new ZipEntry(firstFile.getName());
            FileInputStream firstInput = new FileInputStream(firstFile);
            zos.putNextEntry(firstEntry);
            byte[] firstData = new byte[1024];
            int firstCount;
            while ((firstCount = firstInput.read(firstData)) != -1) {
                zos.write(firstData, 0, firstCount);
            }
            firstInput.close();
            zos.closeEntry();

            // Add the second file to the ZipOutputStream using ZipEntry
            File secondFile = new File(cdmqExamName);
            ZipEntry secondEntry = new ZipEntry(secondFile.getName());
            FileInputStream secondInput = new FileInputStream(secondFile);
            zos.putNextEntry(secondEntry);
            byte[] secondData = new byte[1024];
            int secondCount;
            while ((secondCount = secondInput.read(secondData)) != -1) {
                zos.write(secondData, 0, secondCount);
            }
            secondInput.close();
            zos.closeEntry();

            // Close the ZipOutputStream and ByteArrayOutputStream
            zos.close();
            baos.close();

            // delete the word file
            firstFile.delete();
            secondFile.delete();
        }
        catch (Exception e){
            System.out.println("error with the files, " + e.getLocalizedMessage());
        }

        // Set the response headers
        byte[] zipData = baos.toByteArray();
        return zipData;
    }
}
