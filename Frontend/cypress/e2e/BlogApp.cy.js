describe("Blog App", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    const newUser = {
      name: "Huzaifa Ahmed",
      username: "Artis_",
      password: "Artis123",
    };
    cy.request("POST", "http://localhost:3001/api/users", newUser);

    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  describe("Login", function () {
    it("Logs In with correct credentials", function () {
      cy.get("#userInp").type("Artis_");
      cy.get("#passInp").type("Artis123");
      cy.get(".loginBtn").click();

      cy.contains("Huzaifa Ahmed logged in");
    });

    it("Login fails with wrong credentials", function () {
      cy.get("#userInp").type("Artis_");
      cy.get("#passInp").type("Artis");
      cy.get(".loginBtn").click();

      cy.contains("Incorrect Username or Password").should("be.visible").should("have.class", "alert-danger");
    });
  });

  describe("When Logged in", function () {
    beforeEach(function () {
      cy.get("#userInp").type("Artis_");
      cy.get("#passInp").type("Artis123");
      cy.get(".loginBtn").click();
    });

    it("Blog can be created.", function () {
      cy.get(".toggleButton").contains("Add New").click();
      cy.get(".titleInput").type("Test Blog");
      cy.get(".urlInput").type("Shaat");
      cy.get(".addBlogBtn").click();

      cy.contains("Success").should("be.visible");
      cy.contains("Test Blog - Huzaifa Ahmed").should("be.visible");
    });

    describe("For an existing blog", function () {
      beforeEach(function () {
        cy.get(".toggleButton").contains("Add New").click();
        cy.get(".titleInput").type("Test Blog");
        cy.get(".urlInput").type("Shaat");
        cy.get(".addBlogBtn").click();
        cy.wait(500);
        cy.get(".titleInput").type("Test Blog 2");
        cy.get(".urlInput").type("Shaat");
        cy.get(".addBlogBtn").click();
        cy.get(".btn").contains("View").click();

        const newUser = {
          name: "Huzaif Ahmed",
          username: "Artis2_",
          password: "Artis123",
        };
        cy.request("POST", "http://localhost:3001/api/users", newUser);
    
      });

      it("Blog can be liked", function () {
        cy.get(".btn").contains("Like").click();
        cy.get(".likes").should("contain", "1");
      });
  
      it("Blog can be deleted by authors", function () {
        cy.get(".btn").contains("Delete").click();
        cy.contains("Test Blog - Huzaifa Ahmed").should("not.exist");
      });

      it("Users who are not the author should not see delete button", function () {
        cy.contains("Log out").click();
        cy.get("#userInp").type("Artis2_");
        cy.get("#passInp").type("Artis123");
        cy.get(".loginBtn").click();

        cy.get(".btn").contains("View").click();
        cy.get(".btn").contains("Delete").should("not.exist");
      });

      it.only("Blogs are sorted according to likes", function () {
        cy.get(".blog").eq(1).contains("View").click();
        cy.get(".blog").eq(1).find(".btn").contains("Like").click();
        
        cy.reload();

        cy.get(".blog").eq(0).should("contain", "Likes: 1");
        cy.get(".blog").eq(1).should("contain", "Likes: 0");
      });
    });
  });
});
