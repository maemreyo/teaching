# Prompt Management System for EduGameHub

## Prompt Directory Structure
All AI prompts are stored in the `/prompts/` directory with clear naming conventions and version control.

## Available Prompts

### 1. Curriculum PDF Parser (`prompts/curriculum-pdf-parser.md`)
**Purpose**: Few-shot prompt for Gemini AI to parse curriculum PDFs into EduGameHub database schema format

**Key Features**:
- Complete database schema documentation
- Detailed JSON output format specification
- Few-shot examples with input/output pairs
- Quality standards and error handling instructions
- Educational content extraction guidelines

**Usage**:
1. Copy the prompt content
2. Append the PDF content to be parsed
3. Submit to Gemini AI for structured data extraction
4. Validate and import the returned JSON into database

**Target Schema Tables**:
- curricula (metadata)
- units (structure)
- vocabulary (with IPA, translations, examples)
- grammar_rules (with exercises)
- language_functions (communication)
- pronunciation_focuses (phonetics)
- cultural_notes (context)
- assessments (evaluation)

**Output Format**: Complete JSON matching database insert requirements

## Prompt Development Guidelines

### Content Standards
- **Specificity**: Clear, detailed instructions with examples
- **Schema Compliance**: Exact match with database structure
- **Educational Quality**: Maintain pedagogical value in generated content
- **Error Handling**: Graceful handling of missing or incomplete data

### Format Requirements
- **Structure**: System instructions → Schema → Examples → Instructions
- **Examples**: Minimum 2 complete input/output pairs
- **Validation**: Include data quality and format validation rules
- **Versioning**: Track prompt versions for consistency

### Maintenance Process
1. **Version Control**: Track changes to prompt effectiveness
2. **Testing**: Validate with sample curriculum content
3. **Refinement**: Improve based on AI output quality
4. **Documentation**: Update memory when prompts change

## Future Prompt Categories

### Planned Additions
- **Game Content Generator**: Convert curriculum to game mechanics
- **Assessment Builder**: Generate quiz/test content from units
- **Dialogue Creator**: Build conversation scenarios from vocabulary
- **Exercise Generator**: Create practice activities for grammar rules
- **Cultural Content Enhancer**: Expand cultural context and discussions

### Integration Points
- **Database Schema**: All prompts target EduGameHub schema
- **Multi-language**: Support for Vietnamese translations
- **Game Mechanics**: Align with Phaser.js game development
- **Assessment System**: Compatible with scoring and progress tracking

## Usage Protocol
1. **Selection**: Choose appropriate prompt for content type
2. **Preparation**: Gather source material (PDFs, documents)
3. **Execution**: Submit to target AI system (Gemini, GPT, etc.)
4. **Validation**: Verify output against schema requirements
5. **Import**: Load structured data into EduGameHub database
6. **Quality Check**: Review educational content accuracy and completeness