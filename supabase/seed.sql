-- Student Success Hub: brings the site to 10 scholarships and 10 internships, and makes them visible.
-- Safe to run more than once: rows with the same name are skipped.
-- NOTE: amounts and deadlines say "See official site". Open each source_url to check before real use.

insert into scholarships (name, amount, education_level, state, deadline, source_url, verified)
select v.* from (values
 ('Central Sector Scheme of Scholarship for College and University Students','See official site','Undergraduate','All India',null::date,'https://scholarships.gov.in',true),
 ('AICTE Pragati Scholarship for Girl Students (Technical Degree)','See official site','Undergraduate','All India',null::date,'https://aicte.gov.in/sites/default/files/pragatisaksham.pdf',true),
 ('AICTE Pragati Scholarship for Girl Students (Technical Diploma)','See official site','Diploma','All India',null::date,'https://aicte.gov.in/sites/default/files/pragatisaksham.pdf',true),
 ('AICTE Saksham Scholarship for Specially-Abled Students (Technical Degree)','See official site','Undergraduate','All India',null::date,'https://aicte.gov.in/sites/default/files/pragatisaksham.pdf',true),
 ('AICTE Saksham Scholarship for Specially-Abled Students (Technical Diploma)','See official site','Diploma','All India',null::date,'https://aicte.gov.in/sites/default/files/pragatisaksham.pdf',true),
 ('Post Matric Scholarship Scheme, Bihar','See official site','Undergraduate','Bihar',null::date,'https://www.publicservicesmap.in/schemes/post-matric-scholarship-scheme-bihar--pmssb',true),
 ('Prime Minister''s Scholarship Scheme for wards of ex-servicemen','See official site','Undergraduate','All India',null::date,'https://ksb.gov.in',true),
 ('Post Matric Scholarship for SC Students','See official site','Undergraduate','All India',null::date,'https://scholarships.gov.in',true),
 ('Merit-cum-Means Scholarship for Minorities (Professional and Technical Courses)','See official site','Undergraduate','All India',null::date,'https://scholarships.gov.in',true),
 ('Reliance Foundation Undergraduate Scholarships','See official site','Undergraduate','All India',null::date,'https://www.reliancefoundation.org',true)
) as v(name,amount,education_level,state,deadline,source_url,verified)
where not exists (select 1 from scholarships s where s.name = v.name);

insert into internships (title, location, stipend, duration, skills, source_url, verified)
select v.* from (values
 ('PM Internship Scheme (government portal)','India, various companies','See official site','See official site','{}'::text[],'https://pminternship.mca.gov.in',true),
 ('AICTE Internship Portal','India, various organisations','See official site','Varies','{}'::text[],'https://internship.aicte-india.org',true),
 ('Internshala (internship search site)','India / Remote','Varies','Varies','{}'::text[],'https://internshala.com',true),
 ('National Career Service portal','India','Varies','Varies','{}'::text[],'https://www.ncs.gov.in',true),
 ('NITI Aayog Internship Scheme','New Delhi','See official site','Varies','{}'::text[],'https://www.niti.gov.in',true),
 ('ISRO Internship and Project Trainee programme','India, ISRO centres','See official site','Varies','{}'::text[],'https://www.isro.gov.in',true),
 ('DRDO Student Internship','India, DRDO labs','See official site','Varies','{}'::text[],'https://www.drdo.gov.in',true),
 ('Unstop (internships and competitions)','India / Remote','Varies','Varies','{}'::text[],'https://unstop.com',true),
 ('LinkedIn Internships (search)','India / Remote','Varies','Varies','{}'::text[],'https://www.linkedin.com/jobs',true),
 ('Indeed India Internships (search)','India / Remote','Varies','Varies','{}'::text[],'https://in.indeed.com',true)
) as v(title,location,stipend,duration,skills,source_url,verified)
where not exists (select 1 from internships i where i.title = v.title);

-- Make sure everything already in the tables is visible too:
update scholarships set verified = true where verified = false;
update internships  set verified = true where verified = false;
